import { Config } from '../Config'
import chalk from 'chalk'
import { KeytarTokenStorage } from '../keytar/KeytarTokenStorage'
import { TokenStorage } from '../TokenStorage'
import { APIClient, Pull } from '../APIClient'
import { InteractiveApproval } from '../InteractiveApproval'
import { CliInteractiveApprovalDriver } from './CliInteractiveApprovalDriver'
const inquirer = require('inquirer')

/**
 * Starts the CLI.
 */
export async function startCli() {
  try {
    const tokenStorage = new KeytarTokenStorage()
    const config = new Config()
    const args = config.parseArgs(process.argv)
    NiceLogger.info('Hyu — PR approval tool')

    switch (args.command.type) {
      case 'Authenticate': {
        await askForToken(tokenStorage)
        break
      }
      case 'Help': {
        printHelp()
        break
      }
      case 'InteractiveApproval': {
        await interactiveApproval(tokenStorage)
        break
      }
    }
  } catch (error) {
    NiceLogger.error('An error occurred.')
    console.log(error.stack)
    process.exitCode = 1
  }
}

/**
 * Nice logger with colors!
 */
export const NiceLogger = {
  info: (message: string) => console.log(chalk`{blue ℹ} {white ${message}}`),
  success: (message: string) =>
    console.log(chalk`{green ✔} {white ${message}}`),
  error: (message: string) => console.log(chalk`{red 𝒙} {white ${message}}`),
}

/**
 * Asks for a token and saves it to storage.
 *
 * @param tokenStorage
 */
async function askForToken(tokenStorage: TokenStorage) {
  const result = await inquirer.prompt({
    type: 'password',
    name: 'token',
    message: chalk`Please paste in your GitHub Personal Access token (with {bold.green repo} scope) (https://github.com/settings/tokens).`,
  })

  if (!result.token) {
    exitWithError('No token specified.')
  }
  await tokenStorage.setToken(result.token)
  return result.token
}

/**
 * Runs the interactive approval flow.
 *
 * @param tokenStorage
 */
async function interactiveApproval(tokenStorage: TokenStorage) {
  const client = await getAPIClient(tokenStorage)
  const driver = new CliInteractiveApprovalDriver()
  await InteractiveApproval(
    () => client.getPullsWhereReviewIsRequested(),
    (pull, approvalText) => client.approve(pull, approvalText),
    driver
  )
}

/**
 * Gets an API client, authenticates if needed.
 *
 * @param tokenStorage
 */
async function getAPIClient(tokenStorage: TokenStorage) {
  let token = await tokenStorage.getToken()
  if (!token) {
    await askForToken(tokenStorage)
    token = await tokenStorage.getToken()
    /* istanbul ignore next: wont happen unless token storage is bugged */
    if (!token) {
      exitWithError('Token not found.')
    }
  }

  return new APIClient(token)
}

/**
 * Prints the help text.
 */
function printHelp() {
  console.log(chalk`Hyu by {white Jeff Hansen ({blue @jeffijoe})}`)
  console.log()
  console.log('Usage')
  console.log('   hyu          Starts an interactive approval session')
  console.log(
    '   hyu auth     Prompts for GitHub Personal Access Token (can be used to re-authenticate)'
  )
  console.log('   hyu --help   Prints this text.')
}

/**
 * Exit with error code 1.
 *
 * @param message
 */
function exitWithError(message: string): never {
  console.error(message)
  process.exit(1)
}
