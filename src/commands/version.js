import { readFileSync } from "fs";
import { join } from "path";
import { getPackageRoot } from "../utils/paths.js";

// Dynamically fetch the version from package.json in the npm-cred package directory
const packageJsonPath = join(getPackageRoot(), "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

export const version = packageJson.version; // Exports the version for use in other files
