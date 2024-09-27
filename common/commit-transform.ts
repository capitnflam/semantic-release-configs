// eslint-disable-next-line import/no-unresolved
import { type Options } from 'conventional-changelog-writer'

import { isTypes, types } from './types'

const COMMIT_HASH_LENGTH = 7

// eslint-disable-next-line sonarjs/cognitive-complexity
export const transform: Options.Transform = (commit, context) => {
  const newCommit = { ...commit }

  if (newCommit.notes) {
    for (const note of newCommit.notes) {
      note.title = 'Breaking changes'
    }
  }

  if (
    isTypes(newCommit.type) &&
    types.types[newCommit.type] &&
    (types.types[newCommit.type].changelog ||
      (newCommit.notes && newCommit.notes.length > 0))
  ) {
    newCommit['groupType'] =
      // eslint-disable-next-line sonarjs/no-nested-template-literals
      `${types.types[newCommit.type].emoji ? `${types.types[newCommit.type].emoji} ` : ''}${
        types.types[newCommit.type].title
      }`
  } else {
    return false
  }

  if (newCommit.scope === '*') {
    newCommit.scope = ''
  }

  if (typeof newCommit['hash'] === 'string') {
    newCommit['shortHash'] = newCommit['hash'].slice(0, COMMIT_HASH_LENGTH)
  }

  const references: string[] = []

  if (typeof newCommit.subject === 'string') {
    let url = context.repository
      ? `${context.host}/${context.owner}/${context.repository}`
      : context.repoUrl

    if (url) {
      url += '/issues/'
      // Issue URLs.
      if (newCommit.subject) {
        newCommit.subject = newCommit.subject.replace(
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
      newCommit.subject = newCommit.subject.replace(
        // eslint-disable-next-line security/detect-unsafe-regex
        /\B@([\da-z](?:-?[\da-z]){0,38})/g,
        `[@$1](${context.host}/$1)`,
      )
    }
  }

  if (newCommit.references) {
    // Remove references that already appear in the subject
    newCommit.references = newCommit.references.filter(
      (reference) => !references.includes(reference.issue),
    )
  }

  return newCommit
}
