# npm-cred

A secure CLI tool for managing multiple credential vaults. Perfect for developers who need to manage different sets of credentials for various services (GitHub, npm, AWS, etc.).

## Features

- 🔒 **Multiple Secure Vaults**: Create and manage multiple vaults for different purposes (work, personal, etc.)
- 🔑 **Session-Based Security**: Vaults remain unlocked only during your session
- 🎨 **User-Friendly Interface**: Colorful and intuitive CLI interface
- 🛡️ **Secure Storage**: Credentials are stored securely in your system's user data directory
- 🔄 **Flexible Credentials**: Store any type of credential with custom fields

## Installation

```bash
npm install -g npm-cred
```

## Quick Start

1. Create a new vault:
```bash
npm-cred create-vault work-creds mysecretpass
```

2. Unlock your vault:
```bash
npm-cred unlock work-creds mysecretpass
```

3. Add credentials:
```bash
npm-cred add github -u myuser -p mypass -e me@email.com
```

4. View credentials:
```bash
npm-cred get github
```

## Commands

### Vault Management

- `create-vault <name> <password>`: Create a new vault
- `unlock <name> <password>`: Unlock an existing vault
- `vaults`: List all vaults and their status

### Credential Management

- `add <name> [options]`: Add a credential to active vault
  - `-u, --username <username>`: Username
  - `-p, --password <password>`: Password
  - `-e, --email <email>`: Email
  - `-n, --notes <notes>`: Additional notes

- `get <name>`: Get a specific credential
- `remove <name>`: Remove a credential
- `list`: List all credentials in active vault

## Examples

### Managing Multiple Vaults

```bash
# Create separate vaults
npm-cred create-vault personal mysecretpass
npm-cred create-vault work mysecretpass

# Switch between vaults
npm-cred unlock work mysecretpass
npm-cred add github -u workuser -p workpass

npm-cred unlock personal mysecretpass
npm-cred add github -u personaluser -p personalpass
```

### Managing Different Types of Credentials

```bash
# GitHub credentials
npm-cred add github -u myuser -p mypass -e me@email.com

# AWS credentials
npm-cred add aws -u access_key -p secret_key -n "Dev Account"

# Custom service
npm-cred add myservice -u username -p password -n "Important notes"
```

## Debug Mode

Run commands with DEBUG=true for detailed error messages:

```bash
DEBUG=true npm-cred <command>
```

## Storage Location

Credentials are stored securely in your system's user data directory:
- Windows: `%APPDATA%\npm-cred` or `%LOCALAPPDATA%\npm-cred`

## Security Notes

- Vaults are locked by default and must be unlocked with the correct password
- Unlocked vaults remain accessible only during your current session
- Credentials are stored in your system's user data directory
- Each vault maintains its own set of credentials

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
