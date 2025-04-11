import {
  errorMessage,
  warningMessage,
  welcomeMessage,
  successMessage,
} from "./ui.js";

export const displayWelcomeMessage = () => {
  welcomeMessage("Secure Credential Management for npm Projects");
};

export const displayWarningMessage = () => {
  warningMessage("This operation requires careful attention");
};

export const displayErrorMessage = () => {
  errorMessage("An unexpected error occurred during the operation");
};

export const displaySuccessMessage = () => {
  successMessage("Operation completed successfully");
};
