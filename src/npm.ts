import {dbgExec, strExec} from './exec'
import {join} from 'path'

export const createSrcPackage = async (
  packageRoot: string,
  dryRun = false
): Promise<{tar: string; strerr: string}> => {
  const [srcTar, strerr] = await strExec(
    'npm',
    ['pack', ...(dryRun ? ['--dry-run'] : [])],
    {
      cwd: packageRoot
    }
  )
  return {tar: join(packageRoot, `./${srcTar.trim()}`), strerr}
}

export const createTempPackage = async (): Promise<string> => {
  const [tmpPkgRoot] = await strExec('mktemp', ['-d'])
  await dbgExec('npm', ['init', '-y'], {
    cwd: tmpPkgRoot
  })
  return tmpPkgRoot.trim()
}
