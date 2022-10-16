import mongoose from 'mongoose';
import { MONGO_CONNECTION_URL } from './index';

// 'mongodb+srv://inShare:o1dBeDePJNpNj1iy@cluster0.xkjv0m5.mongodb.net/inshare?retryWrites=true&w=majority'

function connectDB () {
    mongoose.connect(MONGO_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.once('open', () => {
        console.log('DB connected...');
    }).on('error',(err) => {
        console.log("connection error : ",err);
    });
}

export default connectDB;

// 'error', console.error.bind(console, 'connection error:')