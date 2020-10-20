import {exec} from '@actions/exec'
import {debug} from '@actions/core'
import {details} from '../message'

const execNpmDryPack = async (packageRoot: string): Promise<Buffer> => {
  const chunks: Buffer[] = []

  await exec('npm', ['pack', '--dry-run'], {
    cwd: packageRoot,
    listeners: {
      debug,
      stdout: chunk => chunks.push(chunk),
      stderr: chunk => chunks.push(chunk)
    }
  })

  return Buffer.concat(chunks)
}

const TITLE = ':package: Packing output'

export const dryPack = async (packageRoot: string): Promise<string> => {
  const buffer = await execNpmDryPack(packageRoot)

  return details(escape(TITLE), escape(buffer.toString('utf-8')))
}
