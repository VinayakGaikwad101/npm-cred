import { readFileSync } from "fs";
import { join } from "path";

// Dynamically fetch the version from package.json
const packageJsonPath = join(process.cwd(), "package.json"); // Ensures it reads from the project root
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

export const version = packageJson.version; // Exports the version for use in other files
