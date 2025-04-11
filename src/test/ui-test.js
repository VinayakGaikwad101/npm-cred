import {
  welcomeMessage,
  warningMessage,
  errorMessage,
  successMessage,
  displayVaults,
  displayList
} from '../utils/ui.js';

// Test welcome message
console.log('\nTesting Welcome Message:');
welcomeMessage('Welcome to npm-cred');

// Test messages with different lengths
console.log('\nTesting Warning Messages:');
warningMessage('Short warning');
warningMessage('This is a longer warning message that should expand the container width');

console.log('\nTesting Error Messages:');
errorMessage('Short error');
errorMessage('This is a longer error message that should expand the container width');

console.log('\nTesting Success Messages:');
successMessage('Short success');
successMessage('This is a longer success message that should expand the container width');

// Test list display with various content lengths
console.log('\nTesting List Displays:');

// Short items
displayList('Commands', [
  'init',
  'add',
  'del'
], {
  color: 'blue',
  itemColor: 'yellow'
});

// Long items
displayList('Environment Variables', [
  'PORT=3000',
  'DATABASE_URL=postgresql://user:password@localhost:5432/mydb',
  'VERY_LONG_ENVIRONMENT_VARIABLE_NAME_WITH_A_VERY_LONG_VALUE_THAT_SHOULD_WRAP_PROPERLY_ACROSS_MULTIPLE_LINES=some-very-long-value',
  'API_KEY=1234567890'
]);

// Test vault display with long names
console.log('\nTesting Vault Display:');
const mockVaultManager = {
  vaults: new Map([
    ['development', {}],
    ['production-environment-credentials-with-very-long-name-that-should-wrap', {}],
    ['staging-environment-with-multiple-secrets-and-configurations', {}],
    ['test', {}]
  ])
};
displayVaults(mockVaultManager);
