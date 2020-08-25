/**
 * Configuration.
 */
export class Config {
  /**
   * Reads the input args.
   * @param argv
   */
  parseArgs(argv: string[]): Args {
    let command: HyuCommand
    switch (argv[2]) {
      case 'auth':
        command = { type: 'Authenticate' }
        break
      case '--help':
      case '-h':
        command = { type: 'Help' }
        break
      default:
        command = { type: 'InteractiveApproval' }
        break
    }

    return { command }
  }
}

/**
 * Arguments.
 */
export interface Args {
  command: HyuCommand
}

/**
 * The command types.
 */
export type HyuCommand =
  | AuthenticateCommand
  | InteractiveApprovalCommand
  | HelpCommand

/**
 * Authenticate command.
 */
export interface AuthenticateCommand {
  type: 'Authenticate'
}

/**
 * Interactive approval command (default).
 */
export interface InteractiveApprovalCommand {
  type: 'InteractiveApproval'
}

/**
 * Print Help command.
 */
export interface HelpCommand {
  type: 'Help'
}
