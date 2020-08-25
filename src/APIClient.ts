import { Octokit } from '@octokit/rest'

/**
 * GitHub API client wrapper.
 */
export class APIClient {
  private client = new Octokit({
    auth: this.token,
  })

  constructor(private token: string) {}

  /**
   * Get PRs where a review has been requested.
   */
  async getPullsWhereReviewIsRequested(): Promise<Pull[]> {
    const iterator = this.client.paginate.iterator(
      this.client.search.issuesAndPullRequests,
      {
        q:
          'state:open is:open is:pr review-requested:@me archived:false review:none',
      }
    )
    const result: Pull[] = []
    for await (const response of iterator) {
      for (const item of response.data) {
        const repoInfo = await (
          await this.client.request({ url: item.repository_url })
        ).data

        const pull: Pull = {
          authorUsername: item.user.login,
          number: item.number,
          title: item.title,
          url: item.html_url,
          owner: repoInfo.owner.login,
          repo: repoInfo.name,
        }
        result.push(pull)
      }
    }
    return result
  }

  /**
   * Approves the PR.
   * @param pull
   * @param approvalText
   */
  async approve(pull: Pull, approvalText: string) {
    await this.client.pulls.createReview({
      owner: pull.owner,
      pull_number: pull.number,
      repo: pull.repo,
      body: approvalText,
      event: 'APPROVE',
    })
  }
}

export interface Pull {
  title: string
  url: string
  authorUsername: string
  owner: string
  repo: string
  number: number
}
