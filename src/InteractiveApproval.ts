import { Pull } from './APIClient'

/**
 * Driver for the Interactive Approval flow.
 */
export interface InteractiveApprovalDriver {
  /**
   * Select the pulls to approve.
   *
   * @param pulls
   */
  prompt(pulls: Pull[]): Promise<PromptResponse>
  /**
   * Called when a PR is approved.
   *
   * @param message
   */
  onApprove(pull: Pull): void
  /**
   * Called when a PR is approved.
   *
   * @param message
   */
  onApproveFailed(pull: Pull, message: string): void
  /**
   * Called when there are no PRs to approve.
   */
  onEmpty(): void
  /**
   * Report an error.
   *
   * @param message
   */
  onError(message: string): void
}

export interface PromptResponse {
  /**
   * Selected Pulls to approve.
   */
  selected: Pull[]
  /**
   * The approval text to use.
   */
  approvalText: string
}

/**
 * Result from interactive approval.
 */
export interface InteractiveApprovalResult {
  /**
   * The PRs that were approved.
   */
  approvedPulls: Pull[]
  /**
   * The PRs that failed to be approved.
   */
  failedPulls: Pull[]
}
export const InteractiveApprovalResult = {
  empty: {
    approvedPulls: [],
    failedPulls: [],
  } as InteractiveApprovalResult,
}

/**
 * Interactive approval flow.
 *
 * @param fetchPulls getter for the pulls
 * @param driver
 */
export async function InteractiveApproval(
  fetchPulls: () => Promise<Pull[]>,
  approve: (pull: Pull, approvalText: string) => Promise<void>,
  driver: InteractiveApprovalDriver
): Promise<InteractiveApprovalResult> {
  const pulls = await fetchPulls()
  const approvedPulls: Pull[] = []
  const failedPulls: Pull[] = []
  if (pulls.length === 0) {
    driver.onEmpty()
    return InteractiveApprovalResult.empty
  }

  const { selected, approvalText } = await driver.prompt(pulls)
  for (const pull of selected) {
    try {
      await approve(pull, approvalText)
      approvedPulls.push(pull)
      driver.onApprove(pull)
    } catch (error) {
      failedPulls.push(pull)
      driver.onApproveFailed(pull, error.message)
    }
  }

  return {
    approvedPulls,
    failedPulls,
  }
}
