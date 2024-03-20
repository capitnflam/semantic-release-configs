import { transform } from './common/commit-transform'
import { plugins, releaseRules } from './common/plugins'

// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  releaseRules,
  parserOpts: {
    mergePattern: /^Merge pull request #(\d+) from (.*)$/,
    mergeCorrespondence: ['id', 'source'],
  },
  writerOpts: {
    transform: transform as unknown,
  },
  plugins: plugins(true),
}
