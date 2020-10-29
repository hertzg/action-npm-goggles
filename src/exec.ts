/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {exec, ExecOptions} from '@actions/exec'
import {debug} from '@actions/core'

const _exec = (...args: any[]): any => {
  debug(`_exec called with ${JSON.stringify({args})}`)
  // @ts-ignore
  return exec(...args)
}

export const dbgExec = async (
  cmd: string,
  args: string[],
  options?: ExecOptions
): Promise<number> => {
  debug(
    `dbgExec called with ${JSON.stringify({
      cmd,
      args,
      options
    })}`
  )
  return _exec(cmd, args, {
    ...(options || {}),
    listeners: {
      debug,
      ...(options?.listeners || {})
    }
  })
}

export const stdExec = async (
  cmd: string,
  args: string[],
  options?: ExecOptions
): Promise<[Buffer, Buffer, Buffer]> => {
  const buffers = [[], [], []] as [Buffer[], Buffer[], Buffer[]]
  await dbgExec(cmd, args, {
    ...(options || {}),
    listeners: {
      ...(options?.listeners || {}),
      debug,
      stdout: chunk => {
        buffers[0].push(chunk)
        buffers[2].push(chunk)
      },
      stderr: chunk => {
        buffers[1].push(chunk)
        buffers[2].push(chunk)
      }
    }
  })

  return buffers.map(chunks => Buffer.concat(chunks)) as [
    Buffer,
    Buffer,
    Buffer
  ]
}

export const strExec = async (
  cmd: string,
  args: string[],
  options?: ExecOptions
): Promise<[string, string, string]> =>
  (await stdExec(cmd, args, options)).map((buffer: Buffer) =>
    buffer.toString('utf-8').replace(/\n$/, '').trim()
  ) as [string, string, string]
