import argparse
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import runner


class RunnerTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.repo = self.root / "repo"
        self.repo.mkdir()
        self.root_patch = patch.object(runner, "ROOT", self.repo)
        self.root_patch.start()
        self.addCleanup(self.root_patch.stop)
        runner.git("init", "-b", "main")
        runner.git("config", "user.name", "Fixture")
        runner.git("config", "user.email", "fixture@example.invalid")
        for name in runner.FILES:
            file = self.repo / name
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_text('export const CatalogSeedVersion = "2026-10-20.1";\n'
                            if name == runner.FILES[2] else "// baseline\n")
        (self.repo / "README.md").write_text("trusted\n")
        runner.git("add", ".")
        runner.git("commit", "-m", "baseline")
        self.baseline = runner.git("rev-parse", "HEAD")
        self.workspace = self.root / "workspace"
        shutil.copytree(self.repo, self.workspace)
        self.artifact = self.root / "artifact"
        self.artifact.mkdir()
        self.result = {"outcome": "changed", "summary": "Fixture", "excluded": [],
                       "sources": ["https://www.mlb.com/schedule", "https://www.espn.com/mlb/schedule"]}

    def changed(self):
        (self.workspace / runner.FILES[0]).write_text("// confirmed change\n")
        (self.workspace / runner.FILES[2]).write_text('export const CatalogSeedVersion = "2026-10-21.1";\n')

    def artifact_for_publish(self, mode="publish"):
        self.changed()
        runner.extract(self.workspace, self.repo, self.artifact, self.result)
        runner.write_json(self.artifact / "agent.json", {
            "is_error": False, "subtype": "success", "structured_output": self.result})
        runner.write_json(self.artifact / "status.json", {
            "mode": mode, "validated": True, "status": "changed",
            "baseline": self.baseline, "repository": "fixture/repo"})
        runner.git("reset", "--hard", self.baseline)
        remote = self.root / "remote.git"
        runner.command("git", "init", "--bare", str(remote))
        runner.git("remote", "add", "origin", str(remote))
        runner.git("push", "origin", "main")
        return argparse.Namespace(state=self.artifact, repository="fixture/repo", run_url="https://example.invalid/run")

    def test_extract_discards_unapproved_edits_and_patch_is_applicable(self):
        self.changed()
        (self.workspace / "README.md").write_text("untrusted change")
        self.assertTrue(runner.extract(self.workspace, self.repo, self.artifact, self.result))
        self.assertEqual((self.repo / "README.md").read_text(), "trusted\n")
        runner.git("reset", "--hard", self.baseline)
        runner.git("apply", "--check", str(self.artifact / "catalog.patch"))

    def test_seed_configuration_changes_rejected(self):
        self.changed()
        with (self.workspace / runner.FILES[2]).open("a") as file:
            file.write("throw new Error('unrelated');\n")
        with self.assertRaisesRegex(ValueError, "Only CatalogSeedVersion"):
            runner.extract(self.workspace, self.repo, self.artifact, self.result)

    def test_symlink_escape_rejected(self):
        self.changed()
        file = self.workspace / runner.FILES[0]
        file.unlink()
        file.symlink_to(self.repo / "README.md")
        with self.assertRaisesRegex(ValueError, "Symlink"):
            runner.extract(self.workspace, self.repo, self.artifact, self.result)

    def test_no_change_and_contradictory_sources_never_produce_publishable_patch(self):
        self.result["outcome"] = "no_change"
        self.assertFalse(runner.extract(self.workspace, self.repo, self.artifact, self.result))
        self.changed()
        self.result["outcome"] = "blocked"
        self.assertFalse(runner.extract(self.workspace, self.repo, self.artifact, self.result))

    def test_no_change_with_edits_rejected(self):
        self.changed()
        self.result["outcome"] = "no_change"
        with self.assertRaisesRegex(ValueError, "disagrees"):
            runner.extract(self.workspace, self.repo, self.artifact, self.result)

    def test_failed_model_and_unverified_sources_rejected(self):
        result_file = self.artifact / "agent.json"
        runner.write_json(result_file, {"is_error": True, "subtype": "success"})
        with self.assertRaisesRegex(ValueError, "successfully"):
            runner.read_result(result_file)
        self.result["sources"] = ["https://www.mlb.com/schedule"]
        runner.write_json(result_file, {"is_error": False, "subtype": "success", "structured_output": self.result})
        with self.assertRaisesRegex(ValueError, "independent"):
            runner.read_result(result_file)

    def test_dry_run_and_smoke_cannot_publish_even_with_token_available(self):
        args = self.artifact_for_publish(mode="dry-run")
        with patch.object(runner, "git") as git:
            with self.assertRaisesRegex(ValueError, "smoke/dry-run"):
                runner.publish(args)
            git.assert_not_called()
        status = json.loads((self.artifact / "status.json").read_text())
        status["mode"] = "smoke"
        runner.write_json(self.artifact / "status.json", status)
        with self.assertRaisesRegex(ValueError, "smoke/dry-run"):
            runner.publish(args)

    def test_uncertain_pr_creation_recovers_without_duplicate_push_or_pr(self):
        args = self.artifact_for_publish()
        real_command = runner.command
        created = []

        def fake_gh(*command, **kwargs):
            if command[:3] == ("gh", "pr", "list"):
                return json.dumps(created)
            if command[:3] == ("gh", "pr", "create"):
                created.append({"url": "https://example.invalid/pr/1"})
                raise subprocess.TimeoutExpired(command, 120)
            return real_command(*command, **kwargs)

        with patch.object(runner, "command", side_effect=fake_gh):
            with self.assertRaises(subprocess.TimeoutExpired):
                runner.publish(args)
            first_head = runner.git("ls-remote", "origin", f"refs/heads/{runner.BRANCH}")
            runner.publish(args)
            self.assertEqual(first_head, runner.git("ls-remote", "origin", f"refs/heads/{runner.BRANCH}"))
            self.assertEqual(len(created), 1)

    def test_main_advance_prevents_stale_publication(self):
        args = self.artifact_for_publish()
        (self.repo / "README.md").write_text("main moved\n")
        runner.git("add", ".")
        runner.git("commit", "-m", "advance main")
        runner.git("push", "origin", "main")
        real_command = runner.command

        def fake_gh(*command, **kwargs):
            return "[]" if command[:3] == ("gh", "pr", "list") else real_command(*command, **kwargs)

        with patch.object(runner, "command", side_effect=fake_gh):
            with self.assertRaisesRegex(ValueError, "Main moved"):
                runner.publish(args)
        self.assertEqual(runner.git("ls-remote", "origin", f"refs/heads/{runner.BRANCH}"), "")

    def test_fake_subprocess_runs_real_extraction_without_model_or_publication(self):
        state = self.root / "smoke-run"
        runner.run(argparse.Namespace(state=state, mode="smoke", repository="fixture/repo"))
        status = json.loads((state / "artifact/status.json").read_text())
        self.assertEqual(status["status"], "changed")
        self.assertFalse(status["validated"])
        self.assertTrue((state / "artifact/catalog.patch").stat().st_size)

    def test_container_receives_only_explicit_model_credentials(self):
        with patch.dict(runner.os.environ, {"ANTHROPIC_API_KEY": "fake-model-key", "MLB_MODEL": "fixture-model", "GH_TOKEN": "do-not-forward"}):
            with patch.object(runner.subprocess, "run") as execute:
                runner.container(self.workspace, self.artifact / "output.log", ["/opt/agent/agent.sh"], model=True)
                argv = execute.call_args_list[0].args[0]
                self.assertIn("ANTHROPIC_API_KEY", argv)
                self.assertIn("MLB_MODEL", argv)
                self.assertNotIn("GH_TOKEN", argv)
                self.assertNotIn("do-not-forward", argv)
                self.assertNotIn("fake-model-key", argv)
                self.assertIn("--user", argv)
                self.assertEqual(execute.call_args_list[-1].args[0][:3], ["docker", "rm", "-f"])

    def test_container_timeout_kills_runner_and_offline_validation_has_no_key(self):
        with patch.object(runner.subprocess, "run", side_effect=[subprocess.TimeoutExpired("docker", 1800), None]) as execute:
            with self.assertRaises(subprocess.TimeoutExpired):
                runner.container(self.workspace, self.artifact / "validation.log", ["pnpm", "typecheck"], network=False)
            argv = execute.call_args_list[0].args[0]
            self.assertIn("--network=none", argv)
            self.assertNotIn("ANTHROPIC_API_KEY", argv)
            self.assertEqual(execute.call_args_list[-1].args[0][:3], ["docker", "rm", "-f"])


if __name__ == "__main__":
    unittest.main()
