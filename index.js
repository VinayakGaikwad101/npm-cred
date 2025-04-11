#!/usr/bin/env node

import { Command } from "commander";
import { displayWelcomeMessage } from "./src/utils/messages.js";
import { VaultManager } from "./src/utils/vaultManager.js"; // Import VaultManager
import { displayVaults } from "./src/utils/ui.js"; // Import displayVaults
import { version } from "./src/commands/version.js";

const program = new Command();
const vaultManager = new VaultManager(); // Create an instance of VaultManager

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
  .command("list-vaults")
  .description("List all vaults")
  .action(() => {
    displayVaults(vaultManager);
  });

// Ensure version command is handled by commander
program.parse(process.argv);
