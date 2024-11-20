import mongoose from 'mongoose'
import logger from '../utils/logger.js';
const mongoUrl = process.env.MONGO_URI;

const connectDb = async () => {
    try {
        await mongoose.connect(mongoUrl)
        logger.info("Mongodb connected")
    }
    catch (err) {
        logger.error(err);
    }
}

export default connectDb;