"""Trusted host controller. Never execute this file from the agent's workspace."""
import argparse
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
INSTRUCTIONS = Path(__file__).resolve().parent
FILES = (
    "packages/data/src/sports/mlb/events.ts",
    "packages/data/src/sports/mlb/subjects.ts",
    "packages/data/src/seed/config.ts",
)
BRANCH = "automation/mlb-catalog"
IMAGE = "mlb-catalog-prototype:local"
CHECKS = (
    "pnpm --filter @dtpt/core build",
    # Root typechecking imports these compiled workers through alchemy.run.ts.
    "pnpm --filter @dtpt/api --filter @dtpt/data --filter @dtpt/jobs build",
    "pnpm --filter @dtpt/data typecheck",
    "pnpm --filter @dtpt/data test",
    "pnpm lint",
    "pnpm typecheck",
)


def command(*args, cwd=None, raw=False, **kwargs):
    output = subprocess.run(args, cwd=cwd or ROOT, check=True, text=True,
                            capture_output=True, timeout=120, **kwargs).stdout
    return output if raw else output.strip()


def git(*args, cwd=None):
    return command("git", *args, cwd=cwd)


def write_json(path, value):
    path.write_text(json.dumps(value, indent=2) + "\n")


def regular_file(root, name):
    path = root / name
    if any(part.is_symlink() for part in [path, *path.parents]):
        raise ValueError(f"Symlink rejected: {name}")
    if not path.is_file() or path.stat().st_size > 2_000_000:
        raise ValueError(f"Missing, nonregular or oversized file: {name}")
    return path


def read_result(path):
    if path.stat().st_size > 4_000_000:
        raise ValueError("Agent output too large")
    envelope = json.loads(path.read_text())
    if envelope.get("is_error") is not False or envelope.get("subtype") != "success":
        raise ValueError("Agent did not finish successfully (including budget/turn limit)")
    result = envelope["structured_output"]
    if result["outcome"] not in ("changed", "no_change", "blocked"):
        raise ValueError("Invalid agent outcome")
    if not isinstance(result["summary"], str) or len(result["summary"]) > 20_000:
        raise ValueError("Invalid summary")
    for key in ("sources", "excluded"):
        if not isinstance(result[key], list) or len(result[key]) > 100:
            raise ValueError(f"Invalid {key}")
        if any(not isinstance(item, str) or len(item) > 4000 for item in result[key]):
            raise ValueError(f"Invalid {key} item")
    if result["outcome"] == "changed":
        hosts = {urlparse(url).hostname for url in result["sources"]
                 if urlparse(url).scheme == "https"}
        official = {host for host in hosts if host and (host == "mlb.com" or host.endswith(".mlb.com"))}
        if not official or not hosts - official - {None}:
            raise ValueError("Changed result needs MLB and independent source URLs")
    return result


def extract(workspace, candidate, artifact, result):
    """Copy only regular allowlisted files into a fresh trusted baseline."""
    before = (candidate / FILES[2]).read_text()
    after = regular_file(workspace, FILES[2]).read_text()
    pattern = r'(?m)^export const CatalogSeedVersion = "\d{4}-\d{2}-\d{2}\.\d+";$'
    if not re.search(pattern, after) or re.sub(pattern, "VERSION", before) != re.sub(pattern, "VERSION", after):
        raise ValueError("Only CatalogSeedVersion may change in seed/config.ts")
    for name in FILES:
        shutil.copyfile(regular_file(workspace, name), candidate / name)
    changed = git("diff", "--name-only", cwd=candidate).splitlines()
    patch = command("git", "diff", "--no-ext-diff", "--binary", cwd=candidate, raw=True)
    (artifact / "catalog.patch").write_text(patch)
    if result["outcome"] == "blocked":
        return False
    if (result["outcome"] == "changed") != bool(changed):
        raise ValueError("Reported outcome disagrees with patch")
    if changed and (FILES[2] not in changed or not set(changed).intersection(FILES[:2])):
        raise ValueError("Catalog changes and seed version bump must accompany each other")
    for name in FILES:
        dest = artifact / "files" / name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(candidate / name, dest)
    return bool(changed)


def clone(source, target, baseline, repository):
    command("git", "clone", "--quiet", "--no-hardlinks", str(source), str(target))
    git("checkout", "--quiet", "--detach", baseline, cwd=target)
    git("remote", "set-url", "origin", f"https://github.com/{repository}.git", cwd=target)


def container(workspace, log, args, *, model=False, network=True):
    print(f"Starting isolated container; output: {log.name}", flush=True)
    name = f"mlb-prototype-{os.getpid()}"
    argv = ["docker", "run", "--name", name, "--rm",
            "--user", f"{os.getuid()}:{os.getgid()}", "-e", "HOME=/tmp/agent-home",
            "--cap-drop=ALL", "--security-opt=no-new-privileges", "--pids-limit=512",
            "--cpus=2", "--memory=6g", "--shm-size=1g",
            "-v", f"{workspace}:/workspace",
            "-v", f"{INSTRUCTIONS}:/instructions:ro"]
    if not network:
        argv += ["--network=none"]
    if model:
        if not os.environ.get("ANTHROPIC_API_KEY") or not os.environ.get("MLB_MODEL"):
            raise ValueError("ANTHROPIC_API_KEY and MLB_MODEL are required for live agent runs")
        # Pass only these secrets, never the host environment or GitHub token.
        argv += ["-e", "ANTHROPIC_API_KEY", "-e", "MLB_MODEL",
                 "-e", "IS_SANDBOX=1", "-e", "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1"]
    try:
        with log.open("w") as output, log.with_suffix(".stderr.log").open("w") as errors:
            subprocess.run([*argv, IMAGE, *args], check=True, stdout=output,
                           stderr=errors, timeout=1800)
    finally:
        subprocess.run(["docker", "rm", "-f", name], capture_output=True, timeout=30)


def run(args):
    state = args.state.resolve()
    state.mkdir(parents=True, exist_ok=False)
    artifact = state / "artifact"
    artifact.mkdir()
    baseline = git("rev-parse", "HEAD")
    status = {"baseline": baseline, "mode": args.mode, "repository": args.repository,
              "status": "running", "validated": False}
    write_json(artifact / "status.json", status)
    try:
        workspace, candidate = state / "workspace", state / "candidate"
        print(f"MLB {args.mode}: baseline {baseline}", flush=True)
        clone(ROOT, workspace, baseline, args.repository)
        clone(ROOT, candidate, baseline, args.repository)
        if args.mode == "smoke":
            if getattr(args, "container_smoke", False):
                container(workspace, artifact / "agent.json", ["bash", "-euc",
                    "node --version >&2; pnpm --version >&2; git --version >&2; "
                    "node /opt/browser/browser.cjs --smoke >&2; python3 /opt/agent/smoke.py"], network=False)
                status["container_smoke"] = True
            else:
                # Local fixture: no Docker/model/network; not cloud proof.
                with (artifact / "agent.json").open("w") as output:
                    subprocess.run([sys.executable, str(INSTRUCTIONS / "smoke.py")],
                                   cwd=workspace, check=True, stdout=output, timeout=30)
        else:
            container(workspace, artifact / "agent.json", ["/opt/agent/agent.sh"], model=True)
        result = read_result(artifact / "agent.json")
        write_json(artifact / "result.json", result)
        changed = extract(workspace, candidate, artifact, result)
        status["status"] = result["outcome"]
        if args.mode != "smoke" and result["outcome"] != "blocked":
            # Installation uses unchanged manifests. No API key or publisher token.
            container(candidate, artifact / "install.log", ["pnpm", "install", "--frozen-lockfile"])
            container(candidate, artifact / "validation.log",
                      ["bash", "-euc", " && ".join(CHECKS)], network=False)
            status["validated"] = True
        status["changed"] = changed
        print(f"Outcome: {status['status']}; validated: {status['validated']}", flush=True)
        if result["outcome"] == "blocked":
            raise ValueError("Source research blocked; review result.json")
    except Exception as error:
        status["status"] = "failed" if status["status"] != "blocked" else "blocked"
        status["error"] = str(error)
        raise
    finally:
        write_json(artifact / "status.json", status)


def publish(args):
    """Runs on a separate hosted VM; never runs candidate code or installs deps."""
    artifact = args.state.resolve()
    status = json.loads(regular_file(artifact, "status.json").read_text())
    if status.get("mode") != "publish" or status.get("validated") is not True:
        raise ValueError("Only a validated publish run can publish; smoke/dry-run refused")
    if status.get("repository") != args.repository:
        raise ValueError("Repository mismatch")
    if status.get("status") == "no_change":
        print("No changes; no PR or seed bump.")
        return
    if status.get("status") != "changed":
        raise ValueError("Only changed outcomes can publish")
    baseline = status["baseline"]
    if not re.fullmatch(r"[0-9a-f]{40}", baseline):
        raise ValueError("Invalid baseline")
    git("fetch", "origin", "main")
    git("checkout", "--detach", baseline)
    result = read_result(artifact / "agent.json")
    extract(artifact / "files", ROOT, artifact, result)
    git("add", "--", *FILES)
    tree = git("write-tree")
    remote = git("ls-remote", "--heads", "origin", f"refs/heads/{BRANCH}")
    existing = json.loads(command("gh", "pr", "list", "--repo", args.repository,
                                 "--head", BRANCH, "--state", "open", "--json", "url"))
    if remote:
        git("fetch", "origin", BRANCH)
        if git("rev-parse", "FETCH_HEAD^{tree}") != tree:
            raise ValueError("Existing branch differs; human review required, never force-push")
        # Same tree means a retry after a successful push/uncertain PR response.
    else:
        if existing or git("rev-parse", "origin/main") != baseline:
            raise ValueError("Main moved or PR already exists; rerun research, do not reuse patch")
        git("-c", "user.name=MLB catalog agent", "-c", "user.email=41898282+github-actions[bot]@users.noreply.github.com",
            "commit", "-m", "feat(data): refresh confirmed MLB catalog")
        git("push", "origin", f"HEAD:refs/heads/{BRANCH}")
    if existing:
        print(existing[0]["url"])
        return
    body = artifact / "pr-body.md"
    body.write_text(result["summary"] + "\n\nSources:\n" +
                    "\n".join(f"- {url}" for url in result["sources"]) +
                    "\n\nIntentionally excluded:\n" +
                    "\n".join(f"- {item}" for item in result["excluded"]) +
                    "\n\nValidated in an isolated Linux container:\n```sh\n" +
                    "\n".join(CHECKS) + "\n```\n\n" +
                    f"Baseline: `{baseline}`. [Hosted run]({args.run_url}).\n" +
                    "No merge or deploy. Production database integration was not run. " +
                    "No PR CI coverage is claimed; inspect checks on the exact head before merging.\n")
    print(command("gh", "pr", "create", "--repo", args.repository, "--base", "main",
                  "--head", BRANCH, "--title", "feat(data): refresh confirmed MLB catalog",
                  "--body-file", str(body)))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("run", "publish"))
    parser.add_argument("--state", required=True, type=Path)
    parser.add_argument("--mode", choices=("smoke", "dry-run", "publish"), default="smoke")
    parser.add_argument("--container-smoke", action="store_true", help="Run fake agent plus native tool/browser checks in the built image")
    parser.add_argument("--repository", default="jackbisceglia/dotheyplaytoday")
    parser.add_argument("--run-url", default="")
    arguments = parser.parse_args()
    (run if arguments.action == "run" else publish)(arguments)
