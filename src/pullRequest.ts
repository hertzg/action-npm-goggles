import * as github from '@actions/github'

export const findPullRequestId = async (
  context: typeof github.context
): Promise<number> => {
  return context.issue.number
}
