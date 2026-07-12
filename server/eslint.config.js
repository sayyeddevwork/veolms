import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-console": "error",
    },
  },
  {
    files: ["src/config/validate-env.ts"],
    rules: {
      "no-console": "off",
    },
  },
);
