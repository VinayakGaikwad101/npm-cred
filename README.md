# npm-cred

A secure command-line tool for managing multiple credential vaults. Store and manage your sensitive credentials (like API keys, passwords, tokens) in encrypted vaults with ease.

## Features

- 🔒 Create multiple secure vaults for organizing different types of credentials
- 🔑 Strong encryption for all stored credentials
- 🔐 Lock/unlock vaults with passwords
- ✨ Simple and intuitive command-line interface
- 📝 Store, view, and delete credentials easily
- 🛡️ Secure password validation and storage

## Installation

```bash
npm install -g npm-cred
```

Requires Node.js version 14.16 or higher.

## Quick Start

1. Create a new vault:

```bash
npm-cred create
```

2. Store a credential (vault must be unlocked):

```bash
npm-cred store my-vault api-key "your-secret-api-key"
```

3. View credentials in a vault:

```bash
npm-cred view my-vault
```

## Commands

### Managing Vaults

- **Create a vault**

  ```bash
  npm-cred create
  ```

  Creates a new vault with a name and password (minimum 5 characters each)

- **List all vaults**

  ```bash
  npm-cred list
  ```

  Shows all existing vaults and their lock status

- **Lock a vault**

  ```bash
  npm-cred lock <vault-name>
  ```

  Locks an unlocked vault

- **Unlock a vault**

  ```bash
  npm-cred unlock <vault-name>
  ```

  Unlocks a locked vault using its password

- **Delete a vault**

  ```bash
  npm-cred delete <vault-name>
  ```

  Deletes a vault and all its credentials (requires password verification)

  Use `-f` or `--force` flag to delete without password verification:

  ```bash
  npm-cred delete <vault-name> --force
  ```

### Managing Credentials

- **Store a credential**

  ```bash
  npm-cred store <vault-name> <credential-name> <credential-value>
  ```

  Stores a new credential in an unlocked vault

- **View credentials**

  ```bash
  npm-cred view <vault-name>
  ```

  Displays all credentials in an unlocked vault

- **Delete a credential**
  ```bash
  npm-cred delete-cred <vault-name> <credential-name>
  ```
  Deletes a specific credential from an unlocked vault

## Usage Examples

### Example 1: Managing GitHub Credentials

1. Create a vault for GitHub credentials:

```bash
npm-cred create
# Enter vault name: github-creds
# Enter vault password: your-secure-password
```

2. Unlock the vault:

```bash
npm-cred unlock github-creds
# Enter vault password: your-secure-password
```

3. Store a GitHub token:

```bash
npm-cred store github-creds personal-access-token "ghp_your_token_here"
```

4. View stored credentials:

```bash
npm-cred view github-creds
```

### Example 2: Managing Multiple Projects

1. Create separate vaults for different projects:

```bash
npm-cred create
# Enter vault name: project-a
# Enter vault password: password-a

npm-cred create
# Enter vault name: project-b
# Enter vault password: password-b
```

2. Store different credentials in each vault:

```bash
npm-cred unlock project-a
npm-cred store project-a db-password "db-secret-here"
npm-cred store project-a api-key "api-secret-here"

npm-cred unlock project-b
npm-cred store project-b aws-key "aws-secret-here"
```

## Security Best Practices

1. Use strong, unique passwords for each vault
2. Lock vaults when not in use
3. Don't share vault passwords
4. Use different vaults for different security contexts
5. Regularly review and update stored credentials

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting

### Common Issues

1. **"Command not found" error**

   ```bash
   # If you see: 'npm-cred' is not recognized as an internal or external command
   # Try reinstalling globally with:
   npm uninstall -g npm-cred
   npm install -g npm-cred
   ```

2. **Vault is locked when trying to store/view credentials**

   ```bash
   # First unlock the vault:
   npm-cred unlock <vault-name>
   # Then try your command again
   ```

3. **Forgot vault password**

   - For security reasons, vault passwords cannot be recovered
   - You'll need to delete the vault using the force flag and create a new one:

   ```bash
   npm-cred delete <vault-name> --force
   npm-cred create
   ```

4. **Permission errors on Linux/Mac**
   ```bash
   # If you see permission errors, try:
   sudo npm install -g npm-cred
   ```

### Tips for Beginners

1. **Start Small**
   - Create a test vault first to experiment with the commands
   - Use simple, memorable passwords while learning (but use strong passwords for real credentials!)

2. **Common Workflows**
   
   Basic workflow:
   ```bash
   npm-cred create                        # Create a vault
   npm-cred store vault1 key1 "value1"    # Store a credential
   npm-cred lock vault1                   # Lock when done
   ```
   
   Daily usage workflow:
   ```bash
   npm-cred unlock vault1                 # Start of day
   npm-cred view vault1                   # Use credentials as needed
   npm-cred lock vault1                   # End of day
   ```
   
   Managing multiple vaults:
   ```bash
   npm-cred list                         # Check vault status
   npm-cred unlock vault1                # Unlock needed vault
   npm-cred view vault1                  # Use credentials
   npm-cred lock vault1                  # Lock when done
   ```

3. **Command Structure**
   ```bash
   npm-cred <command> <vault-name> [additional-parameters]
   ```

4. **Getting Help**
   ```bash
   npm-cred --help          # Show all commands
   npm-cred create --help   # Show help for create command
   npm-cred store --help    # Show help for store command
   ```

## Support

If you encounter any issues or have questions, please file an issue at:
https://github.com/VinayakGaikwad101/npm-cred/issues
