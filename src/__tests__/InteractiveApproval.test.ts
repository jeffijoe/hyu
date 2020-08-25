import {
  InteractiveApprovalDriver,
  PromptResponse,
  InteractiveApproval,
} from '../InteractiveApproval'
import { Pull } from '../APIClient'

test('happy', async () => {
  const driver = TestDriver()
  const api = TestAPI()
  const result = await InteractiveApproval(api.fetchPulls, api.approve, driver)

  expect(result.approvedPulls).toHaveLength(1)
  expect(result.failedPulls).toHaveLength(0)

  expect(driver.onApprove).toHaveBeenCalledTimes(1)
  expect(driver.onApprove).toHaveBeenCalledWith(TestPulls[0])
})

test('empty', async () => {
  const driver = TestDriver()
  const api = TestAPI(TestAPIBehavior.Empty)
  await InteractiveApproval(api.fetchPulls, api.approve, driver)

  expect(driver.onEmpty).toHaveBeenCalledTimes(1)
})

test('fail', async () => {
  const driver = TestDriver()
  const api = TestAPI(TestAPIBehavior.FailApproval)
  const result = await InteractiveApproval(api.fetchPulls, api.approve, driver)

  expect(result.approvedPulls).toHaveLength(0)
  expect(result.failedPulls).toHaveLength(1)

  expect(driver.onApproveFailed).toHaveBeenCalledTimes(1)
  expect(driver.onApproveFailed).toHaveBeenCalledWith(TestPulls[0], 'Failed')
})

enum TestAPIBehavior {
  Happy,
  Empty,
  FailApproval,
}

const TestPulls: Pull[] = [
  {
    authorUsername: 'user1',
    number: 1,
    owner: 'owner1',
    repo: 'repo1',
    title: 'title1',
    url: 'url1',
  },
  {
    authorUsername: 'user2',
    number: 2,
    owner: 'owner2',
    repo: 'repo2',
    title: 'title2',
    url: 'url2',
  },
]

function TestAPI(behavior = TestAPIBehavior.Happy) {
  return {
    fetchPulls: jest.fn(
      async (): Promise<Pull[]> =>
        Boolean(behavior & TestAPIBehavior.Empty) ? [] : TestPulls
    ),
    approve: jest.fn(async (pull: Pull, text: string) => {
      if (Boolean(behavior & TestAPIBehavior.FailApproval)) {
        throw new Error('Failed')
      }
    }),
  }
}

function TestDriver(): InteractiveApprovalDriver {
  return {
    onApprove: jest.fn(),
    onApproveFailed: jest.fn(),
    onEmpty: jest.fn(),
    onError: jest.fn(),
    prompt: jest.fn(
      async (pulls: Pull[]): Promise<PromptResponse> => {
        expect(pulls.length).toBeGreaterThan(0)
        return { selected: pulls.slice(0, 1), approvalText: 'Text' }
      }
    ),
  }
}
