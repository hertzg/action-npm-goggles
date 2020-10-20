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

      <details><summary>

      %3Apackage%3A%20Packing%20output
      </summary>
      <blockquote>

      npm%20notice%20%0Anpm%20notice%20%uD83D%uDCE6%20%20fakepackage@1.0.0%0Anpm%20notice%20%3D%3D%3D%20Tarball%20Contents%20%3D%3D%3D%20%0Anpm%20notice%20207B%20package.json%0Anpm%20notice%20%3D%3D%3D%20Tarball%20Details%20%3D%3D%3D%20%0Anpm%20notice%20name%3A%20%20%20%20%20%20%20%20%20%20fakepackage%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0Anpm%20notice%20version%3A%20%20%20%20%20%20%201.0.0%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0Anpm%20notice%20filename%3A%20%20%20%20%20%20fakepackage-1.0.0.tgz%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0Anpm%20notice%20package%20size%3A%20%20238%20B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0Anpm%20notice%20unpacked%20size%3A%20207%20B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0Anpm%20notice%20shasum%3A%20%20%20%20%20%20%20%204efdfe4f81ce57e8974363cb45996be1f131fc4c%0Anpm%20notice%20integrity%3A%20%20%20%20%20sha512-4+uqe80SaNlh6%5B...%5DpsK71E0AUzs/Q%3D%3D%0Anpm%20notice%20total%20files%3A%20%20%201%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0Anpm%20notice%20%0Afakepackage-1.0.0.tgz%0A
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
