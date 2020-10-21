import {code, details} from '../message'
import {strExec} from '../exec'
import {createSrcPackage, createTempPackage} from '../npm'

const execNpmInstall = async (
  packageRoot: string
): Promise<{
  tmpPkgRoot: string
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
    strExec('npm', ['install', '--save', srcTarPath], {
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
    tmpPkgRoot,
    installLog,
    dependencyLog,
    nodeModulesDiskUsageLog
  }
}

export const npmInstall = async (packageRoot: string): Promise<string[]> => {
  const {
    tmpPkgRoot,
    installLog,
    dependencyLog,
    nodeModulesDiskUsageLog
  } = await execNpmInstall(packageRoot)

  return [
    details(`:zap: npm install [in ${tmpPkgRoot}]`, code(installLog)),
    details(
      `:information_source: npm ls --depth=1 [in ${tmpPkgRoot}]`,
      code(dependencyLog)
    ),
    details(
      `:bar_chart: du -hsc node_modules/ [in ${tmpPkgRoot}]`,
      code(nodeModulesDiskUsageLog)
    )
  ]
}
