const { spawn } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname);

const args = [
  '--config', path.join(projectRoot, 'jest.config.js'),
  'tests/DealRequest2.test.js', // Specific test
  '--runInBand',
  '--no-cache',
  '--watchAll=false'
];

const options = {
  stdio: 'inherit',
  shell: true,
  cwd: projectRoot
};

const child = spawn('npx', ['jest', ...args], options);

child.on('close', (code) => {
  process.exit(code);
});
