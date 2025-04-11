import { VaultManager } from "../utils/vaultManager.js";
import {
  displayErrorMessage,
  displaySuccessMessage,
  displayWarningMessage,
} from "../utils/messages.js";
import inquirer from "inquirer";

const vaultManager = new VaultManager();

export const createVaultCommand = async () => {
  try {
    // Ask for vault name
    const nameResponse = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter vault name (minimum 5 characters):",
        validate: (input) => {
          if (input.length < 5) {
            return "Vault name must be at least 5 characters long";
          }
          if (input.includes(" ")) {
            return "Vault name cannot contain spaces";
          }
          if (vaultManager.vaults.has(input)) {
            return "A vault with this name already exists. Please choose a different name.";
          }
          return true;
        },
      },
    ]);

    // Ask for password
    const passwordResponse = await inquirer.prompt([
      {
        type: "password",
        name: "password",
        message: "Enter vault password (minimum 5 characters):",
        validate: (input) => {
          if (input.length < 5) {
            return "Password must be at least 5 characters long";
          }
          return true;
        },
      },
      {
        type: "password",
        name: "confirmPassword",
        message: "Confirm vault password:",
        validate: (input, answers) => {
          if (input !== answers.password) {
            return "Passwords do not match";
          }
          return true;
        },
      },
    ]);

    // Create the vault
    vaultManager.createVault(nameResponse.name, passwordResponse.password);
  } catch (error) {
    displayErrorMessage("Failed to create vault: " + error.message);
  }
};

// Add lock command
export const lockVaultCommand = async () => {
  try {
    const nameResponse = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter vault name to lock:",
        validate: (input) => {
          if (!input) {
            return "Vault name is required";
          }
          return true;
        },
      },
    ]);

    vaultManager.lockVault(nameResponse.name);
  } catch (error) {
    displayErrorMessage("Failed to lock vault: " + error.message);
  }
};

// Add unlock command
export const unlockVaultCommand = async () => {
  try {
    // Ask for vault name
    const nameResponse = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter vault name to unlock:",
        validate: (input) => {
          if (!input) {
            return "Vault name is required";
          }
          return true;
        },
      },
    ]);

    // Ask for password
    const passwordResponse = await inquirer.prompt([
      {
        type: "password",
        name: "password",
        message: "Enter vault password:",
        validate: (input) => {
          if (!input) {
            return "Password is required";
          }
          return true;
        },
      },
    ]);

    const success = vaultManager.unlockVault(
      nameResponse.name,
      passwordResponse.password
    );
    if (!success) {
      displayErrorMessage(
        "Failed to unlock vault. Please check name and password."
      );
    }
  } catch (error) {
    displayErrorMessage("Failed to unlock vault: " + error.message);
  }
};

// Add store credential command
export const storeCredentialCommand = async () => {
  try {
    // Ask for vault name
    const nameResponse = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter vault name:",
        validate: (input) => {
          if (!input) {
            return "Vault name is required";
          }
          return true;
        },
      },
    ]);

    // Ask for password
    const passwordResponse = await inquirer.prompt([
      {
        type: "password",
        name: "password",
        message: "Enter vault password:",
        validate: (input) => {
          if (!input) {
            return "Password is required";
          }
          return true;
        },
      },
    ]);

    // Make sure vault exists
    const vault = vaultManager.vaults.get(nameResponse.name);
    if (!vault) {
      displayErrorMessage(`Vault ${nameResponse.name} does not exist`);
      return;
    }

    // Get credential details
    const credentialResponse = await inquirer.prompt([
      {
        type: "input",
        name: "key",
        message: "Enter credential name:",
        validate: (input) => {
          if (!input) {
            return "Credential name is required";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "value",
        message: "Enter credential value:",
        validate: (input) => {
          if (!input) {
            return "Credential value is required";
          }
          return true;
        },
      },
    ]);

    // Store the credential
    const success = vaultManager.addCredential(
      nameResponse.name,
      passwordResponse.password,
      { key: credentialResponse.key, value: credentialResponse.value }
    );

    if (!success) {
      displayErrorMessage(
        "Failed to store credential. Please check vault name and password."
      );
    }
  } catch (error) {
    displayErrorMessage("Failed to store credential: " + error.message);
  }
};

// Add view credentials command
export const viewCredentialsCommand = async () => {
  try {
    // Ask for vault name
    const nameResponse = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter vault name:",
        validate: (input) => {
          if (!input) {
            return "Vault name is required";
          }
          return true;
        },
      },
    ]);

    // Ask for password
    const passwordResponse = await inquirer.prompt([
      {
        type: "password",
        name: "password",
        message: "Enter vault password:",
        validate: (input) => {
          if (!input) {
            return "Password is required";
          }
          return true;
        },
      },
    ]);

    // Retrieve credentials
    const credentials = vaultManager.getCredentials(
      nameResponse.name,
      passwordResponse.password
    );

    if (!credentials) {
      displayErrorMessage(
        "Failed to view credentials. Please check vault name and password."
      );
      return;
    }

    if (credentials.length === 0) {
      displayWarningMessage("No credentials stored in this vault.");
      return;
    }

    // Display credentials in a formatted way
    console.log("\nCredentials in vault:", nameResponse.name);
    console.log("----------------------------------");
    credentials.forEach((cred, index) => {
      console.log(`${index + 1}. ${cred.key}: ${cred.value}`);
    });
    console.log("----------------------------------");
    displaySuccessMessage("Credentials retrieved successfully.");
  } catch (error) {
    displayErrorMessage("Failed to view credentials: " + error.message);
  }
};

// Add delete credential command
export const deleteCredentialCommand = async () => {
  try {
    // Ask for vault name
    const nameResponse = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter vault name:",
        validate: (input) => {
          if (!input) {
            return "Vault name is required";
          }
          return true;
        },
      },
    ]);

    // Ask for password
    const passwordResponse = await inquirer.prompt([
      {
        type: "password",
        name: "password",
        message: "Enter vault password:",
        validate: (input) => {
          if (!input) {
            return "Password is required";
          }
          return true;
        },
      },
    ]);

    // First check if we can retrieve credentials
    const credentials = vaultManager.getCredentials(
      nameResponse.name,
      passwordResponse.password
    );

    if (!credentials) {
      displayErrorMessage(
        "Failed to access vault. Please check name and password."
      );
      return;
    }

    if (credentials.length === 0) {
      displayWarningMessage("No credentials stored in this vault to delete.");
      return;
    }

    // Show available credentials
    console.log("\nAvailable credentials in vault:", nameResponse.name);
    console.log("----------------------------------");
    credentials.forEach((cred, index) => {
      console.log(`${index + 1}. ${cred.key}`);
    });
    console.log("----------------------------------");

    // Ask which credential to delete
    const deleteResponse = await inquirer.prompt([
      {
        type: "input",
        name: "key",
        message: "Enter the name of the credential to delete:",
        validate: (input) => {
          if (!input) {
            return "Credential name is required";
          }
          if (!credentials.some((cred) => cred.key === input)) {
            return "No credential with that name exists in the vault";
          }
          return true;
        },
      },
    ]);

    // Confirm deletion
    const confirmResponse = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Are you sure you want to delete credential "${deleteResponse.key}"?`,
        default: false,
      },
    ]);

    if (confirmResponse.confirm) {
      const success = vaultManager.deleteCredential(
        nameResponse.name,
        passwordResponse.password,
        deleteResponse.key
      );

      if (!success) {
        displayErrorMessage("Failed to delete credential.");
      }
    } else {
      displayWarningMessage("Deletion cancelled.");
    }
  } catch (error) {
    displayErrorMessage("Failed to delete credential: " + error.message);
  }
};

export const vaultCommands = {
  create: createVaultCommand,
  lock: lockVaultCommand,
  unlock: unlockVaultCommand,
  store: storeCredentialCommand,
  view: viewCredentialsCommand,
  delete: deleteCredentialCommand,
};
