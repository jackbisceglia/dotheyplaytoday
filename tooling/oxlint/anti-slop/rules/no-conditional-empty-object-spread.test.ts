import { RuleTester } from "oxlint/plugins-dev";

import { noConditionalEmptyObjectSpreadRule } from "./no-conditional-empty-object-spread.ts";

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: "ts" } } });
const error = { messageId: "avoid" };

if (!noConditionalEmptyObjectSpreadRule.meta?.messages?.avoid.includes("exactOptional")) {
  throw new Error("The diagnostic must direct callers to exactOptional.");
}

if (noConditionalEmptyObjectSpreadRule.meta?.fixable !== undefined) {
  throw new Error("The rule must not offer an unsafe semantics-changing fix.");
}

tester.run(
  "anti-slop/no-conditional-empty-object-spread",
  noConditionalEmptyObjectSpreadRule,
  {
    valid: [
      "const result = { value };",
      "const result = { ...values };",
      "const result = condition ? { value } : {};",
      "const result = { ...exactOptional(value, value => ({ value })) };",
      "const result = { ...exactOptional(cookie === '' ? undefined : cookie, cookie => ({ cookie })) };",
      "const result = { ...(condition ? { first } : { second }) };",
      "const result = [...(condition ? [] : [value])];",
    ],
    invalid: [
      {
        code: "const result = { ...((value === undefined ? ({}) : { value })) };",
        errors: [error],
      },
      {
        code: "const result = { ...(value !== undefined ? { value } : {}) };",
        errors: [error],
      },
      {
        code: "const result = { ...(condition ? {} : { value }) };",
        errors: [error],
      },
    ],
  },
);
