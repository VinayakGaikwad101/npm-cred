import {
  displayErrorMessage,
  displaySuccessMessage,
  displayWarningMessage,
} from "./messages.js";
import { encrypt, decrypt } from "./crypto.js";

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
        displayErrorMessage(
          "Vault password must be at least 5 characters long"
        );
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
        displayErrorMessage(
          "Vault password must be at least 5 characters long"
        );
        return false;
      }
      try {
        // Decrypt credentials when unlocking
        this.credentials = decrypt(this.encryptedData, password);
        this.isUnlocked = true; // Set the vault as unlocked
        this.password = password; // Store password for future operations
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

  // Add a credential to the vault
  addCredential(credential) {
    if (!this.isUnlocked) {
      displayErrorMessage(`Vault ${this.name} needs to be unlocked first`);
      return false;
    }

    if (!credential || !credential.key || !credential.value) {
      displayErrorMessage("Both key and value are required for the credential");
      return false;
    }

    // Check if credential with the same key already exists
    const existingCredential = this.credentials.find(
      (cred) => cred.key === credential.key
    );
    if (existingCredential) {
      displayErrorMessage(
        `A credential with the key "${credential.key}" already exists. Each credential name must be unique.`
      );
      return false;
    }

    // Add the new credential
    this.credentials.push(credential);

    // Update the encrypted data with the current password
    if (this.password) {
      this.encryptedData = encrypt(this.credentials, this.password);
    }

    displaySuccessMessage(
      `Credential "${credential.key}" added successfully to vault ${this.name}`
    );
    return true;
  }

  // Get all credentials from the vault
  getCredentials() {
    if (!this.isUnlocked) {
      displayErrorMessage(`Vault ${this.name} needs to be unlocked first`);
      return null;
    }

    return this.credentials;
  }

  // Delete a credential from the vault by key
  deleteCredential(key) {
    if (!this.isUnlocked) {
      displayErrorMessage(`Vault ${this.name} needs to be unlocked first`);
      return false;
    }

    if (!key) {
      displayErrorMessage("Credential key is required for deletion");
      return false;
    }

    const initialLength = this.credentials.length;
    this.credentials = this.credentials.filter((cred) => cred.key !== key);

    if (this.credentials.length === initialLength) {
      displayWarningMessage(
        `No credential with key "${key}" found in vault ${this.name}`
      );
      return false;
    }

    // Update the encrypted data with the current password
    if (this.password) {
      this.encryptedData = encrypt(this.credentials, this.password);
    }

    displaySuccessMessage(
      `Credential "${key}" deleted successfully from vault ${this.name}`
    );
    return true;
  }

  // For persistence
  toJSON() {
    return {
      name: this.name,
      encryptedData: this.encryptedData,
      isUnlocked: this.isUnlocked, // Save the lock state
      credentials: this.isUnlocked ? this.credentials : [], // Save credentials if unlocked
    };
  }

  static fromJSON(json, password = null) {
    const vault = new Vault(json.name, null); // Use null for password initially
    vault.encryptedData = json.encryptedData;
    vault.isUnlocked = json.isUnlocked; // Set the lock state from JSON

    // If vault is unlocked, also restore credentials and password
    if (vault.isUnlocked && Array.isArray(json.credentials)) {
      vault.credentials = json.credentials;
      if (password) {
        vault.password = password;
      }
    }

    return vault;
  }

  // Generate a shareable ID containing encrypted vault data
  generateShareId() {
    if (!this.encryptedData) {
      displayErrorMessage("Cannot share an unencrypted vault");
      return null;
    }

    // Create share data object with all necessary vault info
    const shareData = {
      name: this.name,
      encryptedData: this.encryptedData,
      password: this.password, // Include original password
    };

    // Convert to base64
    return Buffer.from(JSON.stringify(shareData)).toString("base64");
  }

  // Create a vault from a share ID
  static fromShareId(shareId) {
    try {
      // Decode share data
      const shareData = JSON.parse(Buffer.from(shareId, "base64").toString());

      // Create new vault with original name and password
      const vault = new Vault(shareData.name, shareData.password);
      vault.encryptedData = shareData.encryptedData;
      vault.isUnlocked = false; // Ensure vault is locked by default

      return vault;
    } catch (error) {
      displayErrorMessage("Invalid share ID");
      return null;
    }
  }
}

export default Vault;
