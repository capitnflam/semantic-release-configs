/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['plugin:@flaminc/recommended', 'plugin:@flaminc/node'],
  parserOptions: {
    project: './tsconfig.lint.json',
  },
}
