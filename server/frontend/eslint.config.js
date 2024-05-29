import { Linter } from "eslint"; // 从 ESLint v9.0.0 开始需要显式导入

export default new Linter.Config({
  env: {
    browser: true,
    es6: true,
  },
  extends: ["react-app", "react-app/jest"],
  rules: {
    "no-console": "off",
  },
});
