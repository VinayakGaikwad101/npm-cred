import { displayErrorMessage, displaySuccessMessage, displayWarningMessage } from "./messages.js";
import { getVaultPath } from "./paths.js";
import { readFileSync, writeFileSync, existsSync } from 'fs';
import Vault from "./vault.js";

export class VaultManager {
  constructor() {
    this.vaults = new Map();
    this.loadVaults();
  }

  // Load vaults from storage
  loadVaults() {
    const vaultPath = getVaultPath();
    if (existsSync(vaultPath)) {
      try {
        const data = readFileSync(vaultPath, 'utf8');
        const vaultData = JSON.parse(data);
        
        // Initialize vaults without decrypting (will decrypt on unlock)
        Object.entries(vaultData).forEach(([name, data]) => {
          // Pass null as password when loading to skip validation
          const vault = Vault.fromJSON(data, null);
          this.vaults.set(name, vault);
        });
      } catch (error) {
        displayErrorMessage("Failed to load vaults from storage");
      }
    }
  }

  // Save vaults to storage
  saveVaults() {
    const vaultPath = getVaultPath();
    try {
      const vaultData = {};
      this.vaults.forEach((vault, name) => {
        vaultData[name] = vault.toJSON();
      });
      writeFileSync(vaultPath, JSON.stringify(vaultData, null, 2));
    } catch (error) {
      displayErrorMessage("Failed to save vaults to storage");
    }
  }

  createVault(name, password) {
    if (!name || !password) {
      displayErrorMessage("Please provide both name and password to create the vault");
      return false;
    }
    if (name.length < 5) {
      displayErrorMessage("Vault name must be at least 5 characters long");
      return false;
    }
    if (name.includes(' ')) {
      displayErrorMessage("Vault name cannot contain spaces");
      return false;
    }
    if (password.length < 5) {
      displayErrorMessage("Password must be at least 5 characters long");
      return false;
    }
    if (this.vaults.has(name)) {
      displayErrorMessage(`Vault with name ${name} already exists, please choose a different name`);
      return false;
    }

    const newVault = new Vault(name, password);
    this.vaults.set(name, newVault);
    this.saveVaults();
    displaySuccessMessage(`Vault ${name} created successfully`);
    return true;
  }

  lockVault(name) {
    const vault = this.vaults.get(name);
    if (!vault) {
      displayErrorMessage(`Vault ${name} does not exist`);
      return false;
    }
    vault.lock(name);
    this.saveVaults();
    return true;
  }

  unlockVault(name, password) {
    if (!name || !password) {
      displayErrorMessage("Please provide both name and password to unlock the vault");
      return false;
    }
    if (name.length < 5) {
      displayErrorMessage("Vault name must be at least 5 characters long");
      return false;
    }
    if (password.length < 5) {
      displayErrorMessage("Password must be at least 5 characters long");
      return false;
    }

    const vault = this.vaults.get(name);
    if (!vault) {
      displayErrorMessage(`Vault with name ${name} does not exist`);
      return false;
    }

    const success = vault.unlock(name, password);
    if (success) {
      this.saveVaults();
    }
    return success;
  }

  deleteVault(name, password, force = false) {
    if (!name) {
      displayErrorMessage("Please provide the vault name to delete");
      return false;
    }
    if (name.length < 5) {
      displayErrorMessage("Vault name should be at least 5 characters long");
      return false;
    }

    const vault = this.vaults.get(name);
    if (!vault) {
      displayErrorMessage(`Vault ${name} does not exist`);
      return false;
    }

    // If force is true, delete without password verification
    if (force) {
      this.vaults.delete(name);
      this.saveVaults();
      displaySuccessMessage(`Vault ${name} deleted successfully`);
      return true;
    }

    // Normal deletion with password verification
    if (!password) {
      displayErrorMessage("Please provide the password to delete the vault");
      return false;
    }
    if (password.length < 5) {
      displayErrorMessage("Password should be at least 5 characters long");
      return false;
    }

    if (vault.unlock(name, password)) {
      this.vaults.delete(name);
      this.saveVaults();
      displaySuccessMessage(`Vault ${name} deleted successfully`);
      return true;
    }
    return false;
  }

  listVaults() {
    if (this.vaults.size === 0) {
      displayWarningMessage("No vaults available.");
      return;
    }

    const vaultNames = [...this.vaults.keys()];
    displaySuccessMessage(`Available vaults: ${vaultNames.join(", ")}`);
  }

  // Add credential to a vault
  addCredential(vaultName, password, credential) {
    const vault = this.vaults.get(vaultName);
    if (!vault) {
      displayErrorMessage(`Vault ${vaultName} does not exist`);
      return false;
    }

    if (vault.unlock(vaultName, password)) {
      const success = vault.addCredential(credential);
      if (success) {
        vault.lock(vaultName);
        this.saveVaults();
        return true;
      }
    }
    return false;
  }

  // Get credentials from a vault
  getCredentials(vaultName, password) {
    const vault = this.vaults.get(vaultName);
    if (!vault) {
      displayErrorMessage(`Vault ${vaultName} does not exist`);
      return null;
    }

    if (vault.unlock(vaultName, password)) {
      const credentials = vault.getCredentials();
      vault.lock(vaultName);
      return credentials;
    }
    return null;
  }
}
