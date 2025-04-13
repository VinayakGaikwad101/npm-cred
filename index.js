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

// Add command to lock a vault
program
  .command("lock <name>")
  .description("Lock an existing vault")
  .action((name) => {
    vaultManager.lockVault(name);
  });

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

// Add command to store a credential in a vault
program
  .command("store")
  .description("Store a credential in a vault (vault must be unlocked)")
  .argument("<vault>", "Name of the vault to store the credential in")
  .argument("<key>", "Name/key of the credential")
  .argument("<value>", "Value of the credential")
  .action(async (vaultName, key, value) => {
    try {
      const vault = vaultManager.vaults.get(vaultName);
      
      if (!vault) {
        console.error(`Vault ${vaultName} does not exist`);
        return;
      }
      
      // Check if vault is unlocked
      if (!vault.isUnlocked) {
        console.error(`Cannot store credential in vault ${vaultName} - Vault is locked. Please unlock it first using 'npm-cred unlock ${vaultName}'`);
        return;
      }
      
      // Store credential since vault is already unlocked
      const success = vaultManager.addCredential(
        vaultName,
        null, // No password needed when already unlocked
        { key, value }
      );
      
      if (!success) {
        console.error("Failed to store credential.");
      }
    } catch (error) {
      console.error("Failed to store credential:", error.message);
    }
  });

// Add command to view credentials in a vault
program
  .command("view")
  .description("View credentials in a vault (vault must be unlocked)")
  .argument("<vault>", "Name of the vault to view credentials from")
  .action(async (vaultName) => {
    try {
      const vault = vaultManager.vaults.get(vaultName);
      
      if (!vault) {
        console.error(`Vault ${vaultName} does not exist`);
        return;
      }
      
      // Check if vault is unlocked
      if (!vault.isUnlocked) {
        console.error(`Cannot view vault ${vaultName} - Vault is locked. Please unlock it first using 'npm-cred unlock ${vaultName}'`);
        return;
      }
      
      // Get credentials since the vault is already unlocked
      const credentials = vaultManager.getCredentials(vaultName, null);
      
      if (credentials.length === 0) {
        console.warn("No credentials stored in this vault.");
        return;
      }
      
      console.log("\nCredentials in vault:", vaultName);
      console.log("----------------------------------");
      credentials.forEach((cred, index) => {
        console.log(`${index + 1}. ${cred.key}: ${cred.value}`);
      });
      console.log("----------------------------------");
    } catch (error) {
      console.error("Failed to view credentials:", error.message);
    }
  });

// Add command to delete a credential from a vault
program
  .command("delete-cred")
  .description("Delete a credential from a vault (vault must be unlocked)")
  .argument("<vault>", "Name of the vault containing the credential")
  .argument("<key>", "Name/key of the credential to delete")
  .action(async (vaultName, key) => {
    try {
      const vault = vaultManager.vaults.get(vaultName);
      
      if (!vault) {
        console.error(`Vault ${vaultName} does not exist`);
        return;
      }
      
      // Check if vault is unlocked
      if (!vault.isUnlocked) {
        console.error(`Cannot delete credential from vault ${vaultName} - Vault is locked. Please unlock it first using 'npm-cred unlock ${vaultName}'`);
        return;
      }
      
      // Confirm deletion
      const { confirm } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to delete credential "${key}"?`,
        default: false
      }]);
      
      if (!confirm) {
        console.warn("Deletion cancelled.");
        return;
      }
      
      const success = vaultManager.deleteCredential(vaultName, null, key);
      
      if (!success) {
        console.error("Failed to delete credential.");
      }
    } catch (error) {
      console.error("Failed to delete credential:", error.message);
    }
  });

// Add command to share a vault
program
  .command("share")
  .description("Share a vault by generating a share ID")
  .argument("<vault>", "Name of the vault to share")
  .action((vaultName) => {
    vaultCommands.share(vaultName);
  });

// Add command to receive a shared vault
program
  .command("receive")
  .description("Receive a shared vault using a share ID")
  .action(vaultCommands.receive);

// Ensure version command is handled by commander
program.parse(process.argv);
