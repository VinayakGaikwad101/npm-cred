import { displayErrorMessage, displaySuccessMessage } from "./messages.js";

export class VaultManager {
  constructor() {
    this.vaults = new Map();
  }
  createVault(name, password) {
    if (!name || !password) {
      displayErrorMessage(
        "Please provide both name and password to unlock the vault"
      );
    }
    if (name.length < 5) {
      displayErrorMessage("Vault name must be at least 5 characters long");
    }
    if (password.length < 5) {
      displayErrorMessage("Password must be at least 5 characters long");
    }
    if (this.vaults.has(name)) {
      displayErrorMessage(
        `Vault with name ${name} already exists, please choose a different name`
      );
      return;
    }
    const newVault = new Vault(name, password);
    this.vaults.set(name, newVault);
    displaySuccessMessage(`Vault ${name} created successfully`);
  }
  unlockVault(name, password) {
    if (!name || !password) {
      displayErrorMessage(
        "Please provide both name and password to unlock the vault"
      );
    }
    if (name.length < 5) {
      displayErrorMessage("Vault name must be at least 5 characters long");
    }
    if (password.length < 5) {
      displayErrorMessage("Password must be at least 5 characters long");
    }
    const vault = this.vaults.get(name);
    if (!vault) {
      displayErrorMessage(`Vault with name ${name} does not exist`);
      return false;
    }
    return vault.unlock(name, password);
  }

  deleteVault(name, password) {
    if (!name || !password) {
      displayErrorMessage(
        "Please provide both name and password to delete the vault"
      );
      return;
    }
    if (name.length < 5) {
      displayErrorMessage("Vault name should be atleast 5 characters long");
      return;
    }
    if (password.length < 5) {
      displayErrorMessage("Password should be atleast 5 characters long");
    }
    const vault = this.vaults.get(name);
    if (!vault) {
      displayErrorMessage(`Vault ${name} does not exist`);
      return false;
    }
    this.vaults.delete(name);
    displaySuccessMessage(`Vault ${name} deleted successfully`);
  }

  listVaults() {
    const vaultNames = [...this.vaults.keys()].join(", ");
    if (vaultNames.length > 0) {
      displaySuccessMessage(`List of vaults: ${vaultNames}`);
    } else {
      displayWarningMessage("No vaults available.");
    }
  }
}
