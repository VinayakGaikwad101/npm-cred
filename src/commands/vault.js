import { VaultManager } from '../utils/vaultManager.js';
import { displayErrorMessage } from '../utils/messages.js';
import inquirer from 'inquirer';

const vaultManager = new VaultManager();

export const createVaultCommand = async () => {
  try {
    // Ask for vault name
    const nameResponse = await inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: 'Enter vault name (minimum 5 characters):',
      validate: (input) => {
        if (input.length < 5) {
          return 'Vault name must be at least 5 characters long';
        }
        if (input.includes(' ')) {
          return 'Vault name cannot contain spaces';
        }
        if (vaultManager.vaults.has(input)) {
          return 'A vault with this name already exists. Please choose a different name.';
        }
        return true;
      }
    }]);

    // Ask for password
    const passwordResponse = await inquirer.prompt([
      {
        type: 'password',
        name: 'password',
        message: 'Enter vault password (minimum 5 characters):',
        validate: (input) => {
          if (input.length < 5) {
            return 'Password must be at least 5 characters long';
          }
          return true;
        }
      },
      {
        type: 'password',
        name: 'confirmPassword',
        message: 'Confirm vault password:',
        validate: (input, answers) => {
          if (input !== answers.password) {
            return 'Passwords do not match';
          }
          return true;
        }
      }
    ]);

    // Create the vault
    vaultManager.createVault(nameResponse.name, passwordResponse.password);

  } catch (error) {
    displayErrorMessage('Failed to create vault: ' + error.message);
  }
};

// Add lock command
export const lockVaultCommand = async () => {
  try {
    const nameResponse = await inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: 'Enter vault name to lock:',
      validate: (input) => {
        if (!input) {
          return 'Vault name is required';
        }
        return true;
      }
    }]);

    vaultManager.lockVault(nameResponse.name);
  } catch (error) {
    displayErrorMessage('Failed to lock vault: ' + error.message);
  }
};

export const vaultCommands = {
  create: createVaultCommand,
  lock: lockVaultCommand // Add lock command to the exports
};
