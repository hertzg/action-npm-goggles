import * as github from '@actions/github'

export const escape = (str: string): string =>
  str.replace(/%/g, '%25').replace(/\n/g, '%0A').replace(/\r/g, '%0D')

export const details = (
  title: string,
  content: string,
  open = false
): string => `<details${open ? ' open' : ''}><summary>

${title}
</summary>
<blockquote>

${content}
</blockquote>
</details>`

export const header = (
  context: typeof github.context,
  version: string
): string => `# Report for [v${version}](../actions/runs/${context.runNumber})`

export const compose = (
  context: typeof github.context,
  version: string,
  ...sections: string[]
): string => `
${header(context, version)}

${sections.join('\n')}
`
