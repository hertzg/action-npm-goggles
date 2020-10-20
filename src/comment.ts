import {context, getOctokit} from '@actions/github'

const findFirstPreviousCommentIdByLogin = async (
  octokit: ReturnType<typeof getOctokit>,
  repo: typeof context.repo,
  issue_number: number,
  login: string
): Promise<number | null> => {
  const {data: comments} = await octokit.issues.listComments({
    ...repo,
    issue_number
  })

  const comment = comments.find(c => c.user.login === login)
  if (!comment) {
    return null
  }

  return comment.id
}

export const createComment = async (
  octokit: ReturnType<typeof getOctokit>,
  repo: typeof context.repo,
  issue_number: number,
  body: string
): Promise<void> => {
  await octokit.issues.createComment({
    ...repo,
    issue_number,
    body
  })
}

export const updateComment = async (
  octokit: ReturnType<typeof getOctokit>,
  repo: typeof context.repo,
  issue_number: number,
  comment_id: number,
  body: string
): Promise<void> => {
  await octokit.issues.updateComment({
    ...repo,
    issue_number,
    comment_id,
    body
  })
}

export const upsertCommentByLogin = async (
  octokit: ReturnType<typeof getOctokit>,
  repo: typeof context.repo,
  login: string,
  issue_number: number,
  body: string
): Promise<unknown> => {
  const comment_id = await findFirstPreviousCommentIdByLogin(
    octokit,
    repo,
    issue_number,
    login
  )

  if (comment_id == null) {
    await createComment(octokit, repo, issue_number, body)
  } else {
    await updateComment(octokit, repo, issue_number, comment_id, body)
  }

  return
}
