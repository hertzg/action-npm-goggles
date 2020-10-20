import {exec, ExecOptions} from '@actions/exec'
import {debug} from '@actions/core'
import {details} from '../message'
import {resolve} from 'path'

const dbgExec = async (
  cmd: string,
  args: string[],
  options?: ExecOptions
): Promise<number> =>
  exec(cmd, args, {
    ...(options || {}),
    listeners: {
      debug,
      ...(options?.listeners || {})
    }
  })

const stdExec = async (
  cmd: string,
  args: string[],
  options?: ExecOptions
): Promise<[Buffer, Buffer]> => {
  const buffers = [[], []] as [Buffer[], Buffer[]]
  await dbgExec(cmd, args, {
    ...(options || {}),
    listeners: {
      ...(options?.listeners || {}),
      debug,
      stdout: chunk => buffers[0].push(chunk),
      stderr: chunk => buffers[1].push(chunk)
    }
  })

  return buffers.map(chunks => Buffer.concat(chunks)) as [Buffer, Buffer]
}

const strExec = async (
  cmd: string,
  args: string[],
  options?: ExecOptions
): Promise<[string, string]> =>
  (await stdExec(cmd, args, options)).map((buffer: Buffer) =>
    buffer.toString('utf-8')
  ) as [string, string]

const createSrcPackage = async (packageRoot: string): Promise<string> => {
  const [srcTar] = await strExec('npm', ['pack'], {
    cwd: packageRoot
  })
  return resolve(packageRoot, `./${srcTar}`)
}

const createTempPackage = async (): Promise<string> => {
  const [tmpPkgRoot] = await strExec('mktemp', ['-d'])
  await dbgExec('npm', ['init', '-y'], {
    cwd: tmpPkgRoot
  })
  return tmpPkgRoot
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
