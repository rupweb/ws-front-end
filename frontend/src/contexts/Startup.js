import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.development') });

const wsUrl = process.env.REACT_APP_WS_URL || 'Not set';
const apiUrl = process.env.REACT_APP_API_URL || 'Not set';
const port = process.env.PORT || 'Not set';

console.log('=================================');
console.log('Starting the React application...');
console.log(`Websocket URL: ${wsUrl}`);
console.log(`API URL: ${apiUrl}`);
console.log(`Running on port: ${port}`);
console.log('=================================');
