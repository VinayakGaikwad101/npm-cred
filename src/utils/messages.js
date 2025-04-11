import {
  errorMessage,
  warningMessage,
  welcomeMessage,
  successMessage,
} from "./ui.js";

export const displayWelcomeMessage = () => {
  welcomeMessage("Secure Credential Management for npm Projects");
};

export const displayWarningMessage = (message) => {
  warningMessage(message);
};

export const displayErrorMessage = (message) => {
  errorMessage(message);
};

export const displaySuccessMessage = (message) => {
  successMessage(message);
};
