const depcheck = require('depcheck');
const { execSync } = require('child_process');
const readline = require('readline');

const options = {
  ignoreBinPackage: true,
  specials: [depcheck.special.npm, depcheck.special.eslint, depcheck.special.react],
  ignore: [
    // Add packages you know are dynamically imported to prevent false positives
    'react-native-vector-icons',
    'react-navigation',
  ],
};

// Utility to ask for confirmation
const askQuestion = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(question, (ans) => {
    rl.close();
    resolve(ans.toLowerCase());
  }));
};

depcheck(process.cwd(), options).then(async (unused) => {
  const unusedDeps = unused.dependencies;
  if (unusedDeps.length === 0) {
    console.log('No unused dependencies found!');
    return;
  }

  console.log('Unused dependencies detected:');
  console.log(unusedDeps.join(', '));

  for (const pkg of unusedDeps) {
    const answer = await askQuestion(`Do you want to uninstall "${pkg}"? (y/n): `);
    if (answer === 'y' || answer === 'yes') {
      console.log(`Uninstalling ${pkg}...`);
      try {
        execSync(`npm uninstall ${pkg}`, { stdio: 'inherit' });
        // For yarn: execSync(`yarn remove ${pkg}`, { stdio: 'inherit' });
      } catch (err) {
        console.error(`Failed to uninstall ${pkg}:`, err);
      }
    } else {
      console.log(`Skipped ${pkg}`);
    }
  }

  console.log('Done checking unused packages!');
});
