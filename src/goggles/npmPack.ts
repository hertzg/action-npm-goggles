import {details} from '../message'
import {stdExec} from '../exec'

const execNpmDryPack = async (packageRoot: string): Promise<Buffer> => {
  const [, stderr] = await stdExec('npm', ['pack', '--dry-run'], {
    cwd: packageRoot
  })

  return stderr
}

const TITLE = ':package: npm pack'

export const npmPack = async (packageRoot: string): Promise<string> => {
  const buffer = await execNpmDryPack(packageRoot)

  return details(TITLE, `\n\n\`\`\`\n${buffer.toString('utf-8')}\n\`\`\`\n`)
}
