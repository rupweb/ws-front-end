import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Resolved path:', path.resolve(__dirname, '../aeron/v2/DealRequestEncoder.js'));
