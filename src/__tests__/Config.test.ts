import { Config } from '../Config'

test('parse args', () => {
  const config = new Config()

  expect(config.parseArgs(['node', 'some-file.js', 'auth']).command.type).toBe(
    'Authenticate'
  )
  expect(config.parseArgs(['node', 'some-file.js']).command.type).toBe(
    'InteractiveApproval'
  )

  expect(
    config.parseArgs(['node', 'some-file.js', '--help']).command.type
  ).toBe('Help')

  expect(config.parseArgs(['node', 'some-file.js', '-h']).command.type).toBe(
    'Help'
  )
})
