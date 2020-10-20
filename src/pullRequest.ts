import * as github from '@actions/github'
import {debug} from '@actions/core'

export const findPullRequestId = async (
  context: typeof github.context
): Promise<number> => {
  debug(`findPullRequestId returning ${context.issue.number}`)
  return context.issue.number
}
