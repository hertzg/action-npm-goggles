import {context, getOctokit} from '@actions/github'
import {debug} from '@actions/core'

const findFirstPreviousCommentIdByLogin = async (
  octokit: ReturnType<typeof getOctokit>,
  repo: typeof context.repo,
  issue_number: number,
  login: string
): Promise<number | null> => {
  debug(
    `findFirstPreviousCommentIdByLogin ${JSON.stringify({
      repo,
      issue_number,
      login
    })}`
  )

  const {data: comments} = await octokit.issues.listComments({
    ...repo,
    issue_number
  })
  debug(
    `findFirstPreviousCommentIdByLogin got ${JSON.stringify({
      comments
    })}`
  )

  const comment = comments.find(c => c.user.login === login)
  debug(
    `findFirstPreviousCommentIdByLogin matched ${JSON.stringify({
      comment,
      login
    })}`
  )
  if (!comment) {
    return null
  }

  debug(
    `findFirstPreviousCommentIdByLogin returning ${JSON.stringify({
      comment
    })}`
  )
  return comment.id
}

export const createComment = async (
  octokit: ReturnType<typeof getOctokit>,
  repo: typeof context.repo,
  issue_number: number,
  body: string
): Promise<void> => {
  debug(
    `createComment called ${JSON.stringify({
      repo,
      issue_number,
      body
    })}`
  )
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
  debug(
    `updateComment called ${JSON.stringify({
      repo,
      issue_number,
      comment_id,
      body
    })}`
  )
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
  debug(
    `upsertCommentByLogin called ${JSON.stringify({
      repo,
      login,
      issue_number,
      body
    })}`
  )
  const comment_id = await findFirstPreviousCommentIdByLogin(
    octokit,
    repo,
    issue_number,
    login
  )
  debug(
    `comment_id is ${JSON.stringify({
      comment_id
    })}`
  )

  if (comment_id == null) {
    await createComment(octokit, repo, issue_number, body)
  } else {
    await updateComment(octokit, repo, issue_number, comment_id, body)
  }

  return
}
