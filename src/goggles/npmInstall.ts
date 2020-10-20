import {details} from '../message'
import {stdExec} from '../exec'
import {createSrcPackage, createTempPackage} from '../npm'

const execNpmInstall = async (packageRoot: string): Promise<Buffer> => {
  const [{tar: srcTarPath}, tmpPkgRoot] = await Promise.all([
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
