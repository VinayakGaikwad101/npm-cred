#!/usr/bin/env node

import { Command } from "commander";
import inquirer from 'inquirer';
import { displayWelcomeMessage } from "./src/utils/messages.js";
import { VaultManager } from "./src/utils/vaultManager.js";
import { displayVaults } from "./src/utils/ui.js";
import { version } from "./src/commands/version.js";
import { vaultCommands } from "./src/commands/vault.js";

const program = new Command();
const vaultManager = new VaultManager();

// Check if no arguments are passed and show the welcome message
if (process.argv.length <= 2) {
  displayWelcomeMessage();
}

program
  .name("npm-cred")
  .version(version, "-v, --version", "Show the version of the application")
  .description("Manage your credentials securely and easily.")
  .usage("[options] [command]");

// Add command to list vaults
program
  .command("list")
  .description("List all vaults")
  .action(() => {
    displayVaults(vaultManager);
  });

// Add command to create a new vault
program
  .command("create")
  .description("Create a new vault")
  .action(vaultCommands.create);

// Add command to delete a vault
program
  .command("delete")
  .description("Delete an existing vault")
  .argument("<name>", "Name of the vault to delete")
  .option("-f, --force", "Force delete without password verification")
  .action(async (name, options) => {
    if (options.force) {
      vaultManager.deleteVault(name, null, true);
    } else {
      const { password } = await inquirer.prompt([{
        type: 'password',
        name: 'password',
        message: 'Enter vault password:',
        validate: input => input.length >= 5 || 'Password must be at least 5 characters long'
      }]);
      vaultManager.deleteVault(name, password);
    }
  });

// Add command to unlock a vault
program
  .command("unlock")
  .description("Unlock a vault")
  .argument("<name>", "Name of the vault to unlock")
  .action(async (name) => {
    const { password } = await inquirer.prompt([{
      type: 'password',
      name: 'password',
      message: 'Enter vault password:',
      validate: input => input.length >= 5 || 'Password must be at least 5 characters long'
    }]);
    vaultManager.unlockVault(name, password);
  });

// Ensure version command is handled by commander
program.parse(process.argv);
