import express from 'express';
import { APP_PORT, ALLOWED_CLIENTS } from './config';
import connectDB from './config/db';
import router from './routes/files';
import show from './routes/show';
import download from './routes/download';
import path from 'path';
import cors from 'cors';


const app = express();

app.use(express.static('public'));

//Middleware
app.use(express.json());

connectDB();

//Cors
const corsOption = {
    origin: ALLOWED_CLIENTS.split(',')
}

app.use(cors(corsOption));


//Template engine
app.set('views',path.join(__dirname, '/views'));
app.set('view engine','ejs');


// Routes
app.use('/api/files',router);
app.use('/files',show);
app.use('/files/download',download);
// const PORT = process.env.PORT || 3000;

app.listen(APP_PORT, () => {
    console.log(`Litening on the server ${APP_PORT}`);
});