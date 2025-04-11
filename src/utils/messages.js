import {
  errorMessage,
  warningMessage,
  welcomeMessage,
  successMessage,
} from "./ui.js";

export const displayWelcomeMessage = () => {
  welcomeMessage("Welcome to npm-cred: credentials manager");
};

export const displayWarningMessage = () => {
  warningMessage("This is a warning message");
};

export const displayErrorMessage = () => {
  errorMessage("This is an error msg");
};

export const displaySuccessMessage = () => {
  successMessage("This is success msg");
};
