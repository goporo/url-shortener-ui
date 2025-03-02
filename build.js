import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure redirects file is copied to the build output
async function copyRedirects() {
  try {
    const source = path.join(__dirname, 'public', '_redirects');
    const dest = path.join(__dirname, 'build', 'client', '_redirects');

    await fs.copy(source, dest);
    console.log('✅ _redirects file copied successfully');
  } catch (error) {
    console.error('Error copying _redirects file:', error);
  }
}

// Run the copy operation
copyRedirects();
