import { homedir } from 'os';
import { join, dirname } from 'path';
import { mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';

// Get the package root directory
const getPackageRoot = () => {
  // Get the directory path of the current module
  const currentFilePath = fileURLToPath(import.meta.url);
  // Go up two levels from src/utils to reach package root
  return dirname(dirname(dirname(currentFilePath)));
};

// Get the appropriate config directory based on OS
const getConfigDir = () => {
  const platform = process.platform;
  
  if (platform === 'win32') {
    // Windows: %APPDATA%\npm-cred
    return join(process.env.APPDATA || join(homedir(), 'AppData', 'Roaming'), 'npm-cred');
  } else {
    // Linux/Mac: ~/.config/npm-cred
    return join(homedir(), '.config', 'npm-cred');
  }
};

// Ensure config directory exists
const ensureConfigDir = () => {
  const configDir = getConfigDir();
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }
  return configDir;
};

// Get vault storage path
const getVaultPath = () => {
  return join(ensureConfigDir(), 'vaults.json');
};

export {
  getConfigDir,
  ensureConfigDir,
  getVaultPath,
  getPackageRoot
};
