function buildPrettierCommand(filenames) {
  return [`prettier --write ${filenames.join(' ')}`]
}

/** @type {import('lint-staged').Config} */
module.exports = {
  'package.json': (filenames) => [
    `syncpack format ${filenames.map((filename) => `--source '${filename}'`).join(' ')}`,
    'syncpack lint',
  ],
  '*.js': (filenames) => [
    `eslint --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')}`,
  ],
  '*.ts': (filenames) => [
    `eslint --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')}`,
    `tsc --pretty --noEmit`,
  ],
  '*.yml': buildPrettierCommand,
  '*.yaml': buildPrettierCommand,
  '*.md': buildPrettierCommand,
  '*.{html,css}': buildPrettierCommand,
}
