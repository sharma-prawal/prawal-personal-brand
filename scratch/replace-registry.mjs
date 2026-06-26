import fs from "node:fs";
import path from "node:path";

const projectPath = "/Users/prawalsharma/Documents/New project/prawal-personal-brand";
const lockfilePath = path.join(projectPath, "package-lock.json");

try {
  const content = fs.readFileSync(lockfilePath, "utf8");
  const privateUrl = "https://nexus.pvt.dev.dentsu.app/repository/npm/";
  const publicUrl = "https://registry.npmjs.org/";

  if (!content.includes(privateUrl)) {
    console.log("No private registry URLs found in package-lock.json!");
    process.exit(0);
  }

  const occurrences = content.split(privateUrl).length - 1;
  const updatedContent = content.replaceAll(privateUrl, publicUrl);

  fs.writeFileSync(lockfilePath, updatedContent, "utf8");
  console.log(`Successfully replaced ${occurrences} private registry URLs with public NPM registry URLs in package-lock.json!`);
} catch (err) {
  console.error("Error updating package-lock.json:", err);
  process.exit(1);
}
