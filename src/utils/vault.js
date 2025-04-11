import {
  displayErrorMessage,
  displaySuccessMessage,
  displayWarningMessage,
} from "./messages";
class Vault {
  // vault constructor
  constructor(name, password, isUnlocked = false) {
    if (!name || !password) {
      displayErrorMessage("Name and password are required");
      return;
    }
    if (name.length < 5) {
      displayErrorMessage("Vault name must be at least 5 characters long");
    }
    if (password.length < 5) {
      displayErrorMessage("Vault password must be at least 5 characters long");
      return;
    }
    this.name = name;
    this.password = password;
    this.isUnlocked = isUnlocked;
  }

  //   unlock method
  unlock(name, password) {
    if (name.length < 5) {
      displayErrorMessage("Vault name must be at least 5 characters long");
    }
    if (password.length < 5) {
      displayErrorMessage("Vault password must be at least 5 characters long");
    }
    if (name === this.name && password === this.password) {
      this.isUnlocked = true;
      displaySuccessMessage(`Vault ${this.name} unlocked successfully`);
      return true;
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
      this.isUnlocked = false;
      displaySuccessMessage(`Vault ${this.name} locked successfully`);
    } else {
      displayErrorMessage(`Incorrect name for locking the vault`);
    }
  }
}
