import {getInput, setFailed} from '@actions/core'
import {getOctokit} from '@actions/github'
import {join, resolve} from 'path'
import {runAction} from './runAction'

async function run(): Promise<void> {
  try {
    const token: string = getInput('token')
    const octokit = getOctokit(token)
    const login: string = getInput('commenter')
    const packageRootPath: string = getInput('package-root-path')
    const packageJsonPath: string = getInput('package-json-path')

    const resolvedPackageRoot = resolve(packageRootPath)
    const resolvedPackageJsonPath = resolve(
      join(resolvedPackageRoot, packageJsonPath)
    )

    await runAction(octokit, {
      login,
      resolvedPackageRoot,
      resolvedPackageJsonPath
    })
  } catch (error) {
    setFailed(error.stack)
  }
}

run()
