import {details} from '../message'
import {createSrcPackage} from '../npm'

const execNpmDryPack = async (packageRoot: string): Promise<string> => {
  const {strerr} = await createSrcPackage(packageRoot, true)

  return strerr
}

const TITLE = ':package: npm pack'

export const npmPack = async (packageRoot: string): Promise<string> => {
  const packLog = await execNpmDryPack(packageRoot)

  return details(TITLE, `\n\n\`\`\`\n${packLog}\n\`\`\`\n`)
}
