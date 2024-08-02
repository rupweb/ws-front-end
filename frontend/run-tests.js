// Import necessary modules using ES6 import syntax
import { spawn } from 'child_process';
import path from 'path';
import process from 'process';

// Resolve the project root directory
const projectRoot = path.resolve(path.dirname(''));

// Define the arguments for the Jest command
const args = [
  '--config', path.join(projectRoot, 'jest.config.js'),
  'tests/DealRequest2.test.js', // Specific test
  '--runInBand',
  '--no-cache',
  '--watchAll=false'
];

// Define the options for the child process
const options = {
  stdio: 'inherit',
  shell: true,
  cwd: projectRoot
};

// Spawn a child process to run the Jest command
const child = spawn('npx', ['jest', ...args], options);

// Listen for the 'close' event on the child process
child.on('close', (code) => {
  process.exit(code);
});
