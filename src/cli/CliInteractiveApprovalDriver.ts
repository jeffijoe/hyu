import chalk from 'chalk'
import { Pull } from '../APIClient'
import {
  InteractiveApprovalDriver,
  PromptResponse,
} from '../InteractiveApproval'
const inquirer = require('inquirer')
import { NiceLogger } from './cli'

/**
 * CLI driver for interactive approval flow.
 */
export class CliInteractiveApprovalDriver implements InteractiveApprovalDriver {
  async prompt(pulls: Pull[]): Promise<PromptResponse> {
    const { selected, approvalText } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message: 'Which PRs do you want to approve?',
        choices: pulls.map((pull) => ({
          value: pull,
          name: PullFormatter.formatPull(pull),
        })),
      },
      {
        type: 'input',
        name: 'approvalText',
        message: 'What would you like the approval text to say?',
        default:
          '🤖  **beep boop** Approved with Hyu **beep boop** 🤖\n\n![Approved!](https://i.imgflip.com/4clcdt.jpg)\n',
      },
    ])

    return {
      selected,
      approvalText,
    }
  }

  onApprove(pull: Pull): void {
    NiceLogger.success(
      chalk`${PullFormatter.formatOwnerAndRepo(
        pull
      )} was {bold.green approved}!`
    )
  }

  onApproveFailed(pull: Pull, message: string): void {
    NiceLogger.error(
      chalk`${PullFormatter.formatOwnerAndRepo(
        pull
      )} was {bold.red not approved}: {bold.red ${message}}`
    )
  }

  onEmpty(): void {
    NiceLogger.info('No PRs to approve. 😊')
  }

  onError(message: string): void {
    NiceLogger.error(message)
  }
}

/**
 * Pull formatter for CLI output.
 */
export const PullFormatter = {
  formatOwnerAndRepo: (pull: Pull) =>
    chalk`{grey ${pull.owner}/{bold.blue ${pull.repo}}}`,
  formatPull: (pull: Pull) =>
    chalk`{grey ${PullFormatter.formatOwnerAndRepo(pull)} {green #${
      pull.number
    }} by {blue @${pull.authorUsername}}: {grey "{yellow ${
      pull.title
    }}"}} ({blue ${pull.url}})`,
}
