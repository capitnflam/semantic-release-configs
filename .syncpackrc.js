/** @type {import("syncpack").RcFile} */
const config = {
  sortAz: [
    'contributors',
    'dependencies',
    'devDependencies',
    'keywords',
    'peerDependencies',
    'resolutions',
    'scripts',
  ],
  sortFirst: ['name', 'description', 'version', 'author', 'scripts'],
  versionGroups: [
    {
      dependencies: ['**'],
      policy: 'sameRange',
      packages: ['**'],
    },
  ],
  semverGroups: [
    {
      range: '>=',
      dependencyTypes: ['peer'],
      dependencies: ['**'],
      packages: ['**'],
    },
    {
      range: '',
      dependencyTypes: [
        'prod',
        'resolutions',
        'overrides',
        'pnpmOverrides',
        'local',
        'dev',
      ],
      dependencies: ['**'],
      packages: ['**'],
    },
  ],
}

module.exports = config
