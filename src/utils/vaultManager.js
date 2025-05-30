import {
  displayErrorMessage,
  displaySuccessMessage,
  displayWarningMessage,
} from "./messages.js";
import { getVaultPath } from "./paths.js";
import { readFileSync, writeFileSync, existsSync } from "fs";
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
        const data = readFileSync(vaultPath, "utf8");
        const vaultData = JSON.parse(data);

        // Initialize vaults with their passwords
        Object.entries(vaultData).forEach(([name, data]) => {
          // Create vault with its password to ensure proper initialization
          const vault = new Vault(name, data.password);
          vault.encryptedData = data.encryptedData;
          vault.isUnlocked = data.isUnlocked;
          if (data.isUnlocked && Array.isArray(data.credentials)) {
            vault.credentials = data.credentials;
          }
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
      displayErrorMessage(
        "Please provide both name and password to create the vault"
      );
      return false;
    }
    if (name.length < 5) {
      displayErrorMessage("Vault name must be at least 5 characters long");
      return false;
    }
    if (name.includes(" ")) {
      displayErrorMessage("Vault name cannot contain spaces");
      return false;
    }
    if (password.length < 5) {
      displayErrorMessage("Password must be at least 5 characters long");
      return false;
    }
    if (this.vaults.has(name)) {
      displayErrorMessage(
        `Vault with name ${name} already exists, please choose a different name`
      );
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
      displayErrorMessage(
        "Please provide both name and password to unlock the vault"
      );
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

    // If the vault is already unlocked, add credential without unlocking
    if (vault.isUnlocked) {
      const success = vault.addCredential(credential);
      if (success) {
        this.saveVaults();
        return true;
      }
      return false;
    }
    
    // Otherwise try to unlock it
    if (password && vault.unlock(vaultName, password)) {
      const success = vault.addCredential(credential);
      if (success) {
        this.saveVaults();
        return true;
      }
      return false;
    }
    
    displayErrorMessage(`Cannot access vault ${vaultName} - Vault is locked. Please unlock it first.`);
    return false;
  }

  // Get credentials from a vault
  getCredentials(vaultName, password) {
    const vault = this.vaults.get(vaultName);
    if (!vault) {
      displayErrorMessage(`Vault ${vaultName} does not exist`);
      return null;
    }

    // If the vault is already unlocked, get credentials without unlocking
    if (vault.isUnlocked) {
      return vault.getCredentials();
    }
    
    // Otherwise try to unlock it
    if (password && vault.unlock(vaultName, password)) {
      return vault.getCredentials();
    }
    
    displayErrorMessage(`Cannot access vault ${vaultName} - Vault is locked. Please unlock it first.`);
    return null;
  }

  // Delete a credential from a vault
  deleteCredential(vaultName, password, credentialKey) {
    const vault = this.vaults.get(vaultName);
    if (!vault) {
      displayErrorMessage(`Vault ${vaultName} does not exist`);
      return false;
    }

    // If the vault is already unlocked, delete credential without unlocking
    if (vault.isUnlocked) {
      const success = vault.deleteCredential(credentialKey);
      if (success) {
        this.saveVaults();
        return true;
      }
      return false;
    }
    
    // Otherwise try to unlock it
    if (password && vault.unlock(vaultName, password)) {
      const success = vault.deleteCredential(credentialKey);
      if (success) {
        this.saveVaults();
        return true;
      }
      return false;
    }
    
    displayErrorMessage(`Cannot access vault ${vaultName} - Vault is locked. Please unlock it first.`);
    return false;
  }

  // Generate a share ID for a vault
  shareVault(vaultName, password) {
    const vault = this.vaults.get(vaultName);
    if (!vault) {
      displayErrorMessage(`Vault ${vaultName} does not exist`);
      return null;
    }

    // If vault is not unlocked, try to unlock it
    if (!vault.isUnlocked && !vault.unlock(vaultName, password)) {
      displayErrorMessage(`Cannot share vault ${vaultName} - Invalid password or vault is locked`);
      return null;
    }

    const shareId = vault.generateShareId();
    if (shareId) {
      displaySuccessMessage(`Share ID generated for vault ${vaultName}`);
      return shareId;
    }
    return null;
  }

  // Receive a shared vault
  receiveVault(shareId) {
    // Validate input
    if (!shareId) {
      displayErrorMessage("Share ID is required");
      return false;
    }

    // Create new vault from share ID
    const newVault = Vault.fromShareId(shareId);
    if (!newVault) {
      return false;
    }

    // Check if vault with same name already exists
    if (this.vaults.has(newVault.name)) {
      displayErrorMessage(`A vault with name ${newVault.name} already exists`);
      return false;
    }

    // Add new vault to manager
    this.vaults.set(newVault.name, newVault);
    this.saveVaults();
    displaySuccessMessage(`Vault ${newVault.name} received successfully`);
    return true;
  }
}
