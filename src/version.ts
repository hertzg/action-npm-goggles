import {promises as FS} from 'fs'
import * as github from '@actions/github'
import {inc} from 'semver'

export const currentVersion = async (
  packageJsonPath: string
): Promise<string> =>
  (JSON.parse(await FS.readFile(packageJsonPath, {encoding: 'utf8'})) as {
    version: string
  }).version

export const buildVersion = async (
  context: typeof github.context,
  packageJsonPath: string
): Promise<{short: string; full: string}> => {
  const curr = await currentVersion(packageJsonPath)
  const short = `${inc(curr, 'prerelease')}-unreleased.pr${
    context.issue.number
  }.${context.runNumber}`

  return {
    short,
    full: `${short}+sha.${context.sha}`
  }
}
