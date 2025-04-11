import {
  displayErrorMessage,
  displaySuccessMessage,
  displayWarningMessage,
} from "./messages.js";
import { encrypt, decrypt } from './crypto.js';

class Vault {
  constructor(name, password, isUnlocked = false) {
    // Skip validation if password is null (for force operations)
    if (password !== null) {
      if (!name || !password) {
        displayErrorMessage("Name and password are required");
        return;
      }
      if (name.length < 5) {
        displayErrorMessage("Vault name must be at least 5 characters long");
        return;
      }
      if (password.length < 5) {
        displayErrorMessage("Vault password must be at least 5 characters long");
        return;
      }
    }
    
    this.name = name;
    this.password = password;
    this.isUnlocked = isUnlocked;
    this.credentials = [];
    // Only encrypt if we have a password
    if (password !== null) {
      this.encryptedData = encrypt(this.credentials, password);
    }
  }

  unlock(name, password) {
    // Skip validation for force operations
    if (password === null) {
      return true;
    }

    if (name.length < 5) {
      displayErrorMessage("Vault name must be at least 5 characters long");
      return false;
    }
    if (password.length < 5) {
      displayErrorMessage("Vault password must be at least 5 characters long");
      return false;
    }
    
    if (name === this.name && password === this.password) {
      try {
        // Decrypt credentials when unlocking
        this.credentials = decrypt(this.encryptedData, password);
        this.isUnlocked = true;
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
    // Skip validation for force operations
    if (this.password === null) {
      return true;
    }

    if (!name) {
      displayErrorMessage("Vault name is required for locking");
      return false;
    }
    if (name === this.name) {
      // Encrypt credentials when locking
      this.encryptedData = encrypt(this.credentials, this.password);
      this.credentials = []; // Clear decrypted data from memory
      this.isUnlocked = false;
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
      encryptedData: this.encryptedData
    };
  }

  static fromJSON(json, password) {
    const vault = new Vault(json.name, password);
    vault.encryptedData = json.encryptedData;
    return vault;
  }
}

export default Vault;
