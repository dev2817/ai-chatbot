import fs from 'fs';
import "dotenv/config";
import cors from 'cors';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import logger from './utils/logger.js';
import router from './routes/index.js';
import connectDb from './connection/db.js';
import { initializeSocket } from './socket/socket.connection.js';

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/ai-chatbot', router);
app.use('/uploads', express.static(uploadDir));

connectDb();

initializeSocket(server);

const port = process.env.PORT || 5000;

server.listen(port, () => {
    logger.info(`Server listening to port: ${port}`);
});
