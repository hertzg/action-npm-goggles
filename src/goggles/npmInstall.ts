import {details} from '../message'
import {join, resolve} from 'path'
import {dbgExec, stdExec, strExec} from '../exec'

const createSrcPackage = async (packageRoot: string): Promise<string> => {
  const [srcTar] = await strExec('npm', ['pack'], {
    cwd: packageRoot
  })
  return resolve(join(packageRoot, `./${srcTar.trim()}`))
}

const createTempPackage = async (): Promise<string> => {
  const [tmpPkgRoot] = await strExec('mktemp', ['-d'])
  await dbgExec('npm', ['init', '-y'], {
    cwd: tmpPkgRoot
  })
  return tmpPkgRoot.trim()
}

const execNpmInstall = async (packageRoot: string): Promise<Buffer> => {
  const [srcTarPath, tmpPkgRoot] = await Promise.all([
    createSrcPackage(packageRoot),
    createTempPackage()
  ])

  const [stdout] = await stdExec('npm', ['install', srcTarPath], {
    cwd: tmpPkgRoot
  })

  return stdout
}

const TITLE = ':zap: npm install'

export const npmInstall = async (packageRoot: string): Promise<string> => {
  const buffer = await execNpmInstall(packageRoot)

  return details(TITLE, `\n\n\`\`\`\n${buffer.toString('utf-8')}\n\`\`\`\n`)
}
