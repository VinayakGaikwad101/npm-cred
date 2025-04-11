import chalk from "chalk";
import { VaultManager } from "./vaultManager.js"; // Import VaultManager

export const warningMessage = (message) => {
  console.log(
    chalk.bgYellow.black.bold("⚠️  Warning:") + " " + chalk.yellow.bold(message)
  );
};

export const welcomeMessage = (message) => {
  console.log(chalk.white.bold(message));
};

export const successMessage = (message) => {
  console.log(
    chalk.bgGreen.white.bold("✅ Success:") + " " + chalk.green.bold(message)
  );
};

export const errorMessage = (message) => {
  console.log(
    chalk.bgRed.white.bold("❌ Error:") + " " + chalk.red.bold(message)
  );
};

// New function to display vault lists
export const displayVaults = (vaultManager) => {
  const vaultNames = [...vaultManager.vaults.keys()];
  if (vaultNames.length > 0) {
    console.log(chalk.white.bold("List of vaults:"));
    vaultNames.forEach((name) => {
      console.log(chalk.green.bold(name));
    });
  } else {
    warningMessage("No vaults available.");
  }
};
