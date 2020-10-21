import {code, details} from '../message'
import {strExec} from '../exec'
import {createSrcPackage, createTempPackage} from '../npm'

const execNpmInstall = async (
  packageRoot: string
): Promise<{
  installLog: string
  dependencyLog: string
  nodeModulesDiskUsageLog: string
}> => {
  const [{tar: srcTarPath}, tmpPkgRoot] = await Promise.all([
    createSrcPackage(packageRoot),
    createTempPackage()
  ])

  const [
    [installLog],
    [dependencyLog],
    [nodeModulesDiskUsageLog]
  ] = await Promise.all([
    strExec('npm', ['install', srcTarPath], {
      cwd: tmpPkgRoot
    }),
    strExec('npm', ['ls', '--depth=1'], {
      cwd: tmpPkgRoot,
      ignoreReturnCode: true
    }),
    strExec('du', ['-hsc', 'node_modules/'], {
      cwd: tmpPkgRoot,
      ignoreReturnCode: true
    })
  ])

  return {
    installLog,
    dependencyLog,
    nodeModulesDiskUsageLog
  }
}

export const npmInstall = async (packageRoot: string): Promise<string[]> => {
  const {
    installLog,
    dependencyLog,
    nodeModulesDiskUsageLog
  } = await execNpmInstall(packageRoot)

  return [
    details(':zap: npm install', code(installLog)),
    details(':information_source: npm ls --depth=1', code(dependencyLog)),
    details(
      ':information_source: du -hsc node_modules/',
      code(nodeModulesDiskUsageLog)
    )
  ]
}
