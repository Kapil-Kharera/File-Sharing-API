import File from './models/file';
import fs from 'fs';
import connectDB from './config/db'

// const connectDB = require('./config/db');
// const File = require('./models/file');
// const fs = require('fs');

connectDB();

async function deleteData () {
    // get old data
    const pastDate = new Date(Date.now() - (24 * 60 * 60 * 1000));
    const files = await File.findOne({createdAt: {$lt:pastDate}});

    if (files.length) {
        for(const file of files) {
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`Successfully deleted ${file.filename}`);
            }catch (err) {
                console.log(`Error while deleting file ${err}`);
            }
        }
    }
    console.log('Job done!');
}

deleteData().then(() => {
    // console.log('Job done!');
    process.exit();
})