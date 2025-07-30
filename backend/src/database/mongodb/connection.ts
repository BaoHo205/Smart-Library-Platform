import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const MONGODB_URI = process.env.MONGODB_URI as string;
const DATABASE = 'library-platform';

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
}

const connect = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            // useNewUrlParser: true,
			// useUnifiedTopology: true,
            dbName: DATABASE
        });
        console.log(`Connected to MongoDB successfully!`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); 
    }
}

export default { connect };