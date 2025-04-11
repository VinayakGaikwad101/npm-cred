import {
  displayErrorMessage,
  displaySuccessMessage,
  displayWarningMessage,
} from "./messages.js";
import { encrypt, decrypt } from './crypto.js';

class Vault {
  constructor(name, password, isUnlocked = false) {
    if (!name) {
      displayErrorMessage("Name is required");
      return;
    }
    if (name.length < 5) {
      displayErrorMessage("Vault name must be at least 5 characters long");
      return;
    }
    
    this.name = name;
    this.isUnlocked = isUnlocked;
    this.credentials = [];

    if (password) {
      if (password.length < 5) {
        displayErrorMessage("Vault password must be at least 5 characters long");
        return;
      }
      this.encryptedData = encrypt(this.credentials, password);
      this.password = password; // Store password for locking/unlocking
    } else {
      this.encryptedData = null; // No password means no encryption
    }
  }

  unlock(name, password) {
    if (!name) {
      displayErrorMessage("Vault name is required");
      return false;
    }
    if (name.length < 5) {
      displayErrorMessage("Vault name must be at least 5 characters long");
      return false;
    }
    
    if (name === this.name) {
      if (this.isUnlocked) {
        displayWarningMessage(`Vault ${this.name} is already unlocked`);
        return true; // Return true if already unlocked
      }
      if (!password) {
        displayErrorMessage("Password is required to unlock the vault");
        return false;
      }
      if (password.length < 5) {
        displayErrorMessage("Vault password must be at least 5 characters long");
        return false;
      }
      try {
        // Decrypt credentials when unlocking
        this.credentials = decrypt(this.encryptedData, password);
        this.isUnlocked = true; // Set the vault as unlocked
        displaySuccessMessage(`Vault ${this.name} unlocked successfully`);
        return true;
      } catch (error) {
        displayErrorMessage("Failed to decrypt vault data");
        return false;
      }
    } else {
      displayWarningMessage(`Incorrect name or password for vault`);
      return false;
    }
  }

  lock(name) {
    if (!name) {
      displayErrorMessage("Vault name is required for locking");
      return false;
    }
    if (name === this.name) {
      if (!this.isUnlocked) {
        displayWarningMessage(`Vault ${this.name} is already locked`);
        return false;
      }
      // Simply set the vault as locked
      this.isUnlocked = false; // Set the vault as locked
      displaySuccessMessage(`Vault ${this.name} locked successfully`);
      return true;
    } else {
      displayErrorMessage(`Incorrect name for locking the vault`);
      return false;
    }
  }

  // For persistence
  toJSON() {
    return {
      name: this.name,
      encryptedData: this.encryptedData,
      isUnlocked: this.isUnlocked // Save the lock state
    };
  }

  static fromJSON(json) {
    const vault = new Vault(json.name, null); // Use null for password
    vault.encryptedData = json.encryptedData;
    vault.isUnlocked = json.isUnlocked; // Set the lock state from JSON
    return vault;
  }
}

export default Vault;
