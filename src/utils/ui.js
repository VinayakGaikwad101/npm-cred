import chalk from "chalk";
import { VaultManager } from "./vaultManager.js";

// Get terminal width or default to 80
const terminalWidth = process.stdout.columns || 80;
const minWidth = 32;
const maxWidth = Math.min(80, Math.floor(terminalWidth * 0.8));

// Simple banner that adapts to terminal width
const getBanner = () => {
  if (terminalWidth < 50) {
    return chalk.cyan.bold("npm-cred");
  }
  return chalk.cyan.bold("[ npm-cred - secure credentials manager ]");
};

// Wrap text to fit within width
const wrapText = (text, maxWidth) => {
  if (text.length <= maxWidth) return [text];
  
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + ' ' + word).length <= maxWidth) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  
  if (currentLine) lines.push(currentLine);
  return lines;
};

// Create a message box with proper text wrapping
const createMessageBox = (message, { color, label = null }) => {
  const labelWidth = label ? label.length + 3 : 0; // +3 for spacing and brackets
  const contentWidth = Math.min(maxWidth - 4, Math.max(minWidth, message.length + labelWidth));
  const lines = wrapText(message, contentWidth - labelWidth);
  const width = Math.max(contentWidth, minWidth);
  const divider = "─".repeat(width);
  
  let output = "\n" + chalk[color]("┌" + divider + "┐\n");
  
  if (label) {
    const firstLine = lines[0];
    output += chalk[color]("[") + 
              chalk[`bg${color.charAt(0).toUpperCase() + color.slice(1)}`].black.bold(` ${label} `) + 
              chalk[color]("] ") + 
              chalk[color].bold(firstLine) + 
              "\n";
    
    lines.slice(1).forEach(line => {
      output += chalk[color].bold("   " + line) + "\n";
    });
  } else {
    lines.forEach(line => {
      output += chalk[color].bold(" " + line) + "\n";
    });
  }
  
  output += chalk[color]("└" + divider + "┘\n");
  return output;
};

export const warningMessage = (message) => {
  console.log(createMessageBox(message, { color: "yellow", label: "WARNING" }));
};

export const welcomeMessage = (message) => {
  console.log("\n" + getBanner());
  console.log(createMessageBox(message, { color: "cyan" }));
  console.log(chalk.dim("Type 'npm-cred --help' for available commands\n"));
};

export const successMessage = (message) => {
  console.log(createMessageBox(message, { color: "green", label: "SUCCESS" }));
};

export const errorMessage = (message) => {
  console.log(createMessageBox(message, { color: "red", label: "ERROR" }));
};

export const displayList = (title, items, options = {}) => {
  const {
    color = "cyan",
    itemColor = "green",
    emptyMessage = "No items available",
  } = options;

  if (items.length === 0) {
    warningMessage(emptyMessage);
    return;
  }

  console.log("\n" + chalk[color].bold(title));
  console.log(chalk[color]("─".repeat(title.length)));

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const prefix = isLast ? "└─" : "├─";
    
    // Split long items into multiple lines
    const chunks = item.match(new RegExp(`.{1,${Math.min(50, terminalWidth - 10)}}`, 'g')) || [item];
    
    // Print first chunk with prefix
    console.log(chalk[color](prefix) + " " + chalk[itemColor].bold(chunks[0]));
    
    // Print remaining chunks with proper indentation
    chunks.slice(1).forEach(chunk => {
      console.log(chalk[color](isLast ? "  " : "│ ") + " " + chalk[itemColor].bold(chunk));
    });
  });

  console.log();
};

export const displayVaults = (vaultManager) => {
  const vaultNames = [...vaultManager.vaults.keys()];
  displayList("Available Vaults", vaultNames, {
    color: "cyan",
    itemColor: "green",
    emptyMessage: "No vaults available",
  });
};
