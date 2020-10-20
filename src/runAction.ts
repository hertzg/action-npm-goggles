import {context, getOctokit} from '@actions/github'
import {findPullRequestId} from './pullRequest'
import {buildVersion} from './version'
import {upsertCommentByLogin} from './comment'
import {compose} from './message'
import {dryPack} from './goggles/dryPack'

export const runAction = async (
  octokit: ReturnType<typeof getOctokit>,
  {
    login,
    resolvedPackageRoot,
    resolvedPackageJsonPath
  }: {
    login: string
    resolvedPackageRoot: string
    resolvedPackageJsonPath: string
  }
): Promise<void> => {
  const [issue_number, nextVersion] = await Promise.all([
    findPullRequestId(context),
    buildVersion(context, resolvedPackageJsonPath)
  ])

  await upsertCommentByLogin(
    octokit,
    context.repo,
    login,
    issue_number,
    compose(context, nextVersion.short, await dryPack(resolvedPackageRoot))
  )
}
