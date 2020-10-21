import {upsertCommentByLogin} from '../comment'
import {runAction} from '../runAction'
import {resolve} from 'path'

jest.mock('@actions/github', () => {
  return {
    getOctokit() {
      return {}
    },
    context: {
      payload: {},
      eventName: 'mockEvent',
      sha: 'mockSha010203040507',
      ref: 'mockRef',
      workflow: 'mockWorkflow',
      action: 'mockAction',
      actor: 'mockActor',
      job: 'mockJob',
      runNumber: 1234,
      runId: 4321,

      repo: {
        owner: 'mockRepoOwner',
        repo: 'mockRepoName'
      },

      issue: {
        owner: 'mockRepoOwner',
        repo: 'mockRepoName',
        number: 1337
      }
    }
  }
})
jest.mock('../comment')

const mockedUpsertCommentByLogin = upsertCommentByLogin as jest.MockedFunction<
  typeof upsertCommentByLogin
>

const LOGIN = 'mybot'
const PKG_ROOT = resolve(__dirname, './fixtures/fakePackage')
const PKG_JSON = resolve(PKG_ROOT, './package.json')

describe('fakePackage', () => {
  it('should upsertMessage', async () => {
    mockedUpsertCommentByLogin.mockImplementation(
      async (): Promise<unknown> => Promise.resolve()
    )

    await runAction({} as any, {
      login: LOGIN,
      resolvedPackageRoot: PKG_ROOT,
      resolvedPackageJsonPath: PKG_JSON
    })

    expect(mockedUpsertCommentByLogin).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": Array [
          Array [
            Object {},
            Object {
              "owner": "mockRepoOwner",
              "repo": "mockRepoName",
            },
            "mybot",
            1337,
            "
      # Report for [v1.0.1-0-unreleased.pr1337.1234](../actions/runs/1234)

      <details><summary>:package: npm pack</summary>
      <blockquote>

      \`\`\`
      fakepackage-1.0.0.tgz

      \`\`\`
      </blockquote>
      </details>
      <details><summary>:zap: npm install</summary>
      <blockquote>

      \`\`\`
      + fakepackage@1.0.0
      added 1 package in 0.093s

      \`\`\`
      </blockquote>
      </details>
      ",
          ],
        ],
        "results": Array [
          Object {
            "type": "return",
            "value": Promise {},
          },
        ],
      }
    `)
  })
})
