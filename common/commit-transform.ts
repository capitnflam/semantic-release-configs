import { type Options } from 'conventional-changelog-writer'

import { isTypes, types } from './types'

const COMMIT_HASH_LENGTH = 7

// eslint-disable-next-line sonarjs/cognitive-complexity
export const transform: Options.Transform = (commit, context) => {
  if (commit.notes) {
    for (const note of commit.notes) {
      note.title = 'Breaking changes'
    }
  }

  if (
    isTypes(commit.type) &&
    types.types[commit.type] &&
    (types.types[commit.type].changelog ||
      (commit.notes && commit.notes.length > 0))
  ) {
    commit['groupType'] =
      // eslint-disable-next-line sonarjs/no-nested-template-literals
      `${types.types[commit.type].emoji ? `${types.types[commit.type].emoji} ` : ''}${
        types.types[commit.type].title
      }`
  } else {
    return false
  }

  if (commit.scope === '*') {
    commit.scope = ''
  }

  if (typeof commit['hash'] === 'string') {
    commit['shortHash'] = commit['hash'].slice(0, COMMIT_HASH_LENGTH)
  }

  const references: string[] = []

  if (typeof commit.subject === 'string') {
    let url = context.repository
      ? `${context.host}/${context.owner}/${context.repository}`
      : context.repoUrl

    if (url) {
      url += '/issues/'
      // Issue URLs.
      if (commit.subject) {
        commit.subject = commit.subject.replace(
          /#(\d+)/g,
          (_: unknown, issue: string) => {
            references.push(issue)
            return `[#${issue}](${url}${issue})`
          },
        )
      }
    }

    if (context.host) {
      // User URLs.
      commit.subject = commit.subject.replace(
        // eslint-disable-next-line security/detect-unsafe-regex
        /\B@([\da-z](?:-?[\da-z]){0,38})/g,
        `[@$1](${context.host}/$1)`,
      )
    }
  }

  if (commit.references) {
    // Remove references that already appear in the subject
    commit.references = commit.references.filter(
      (reference) => !references.includes(reference.issue),
    )
  }

  return commit
}
