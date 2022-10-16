import route from 'express';
const router = route.Router();
import multer from 'multer';
import path from 'path';
import File from '../models/file';
// console.log(File);
// import {v4: uuid4} from 'uuid';
import {APP_BASE_URL} from '../config';
const {v4: uuidv4} = require('uuid');
import sendMail  from '../services/emailService';
import html from '../services/emailTemplate'

// const router = require('express').Router;

let storage = multer.diskStorage({
    destination: (req,file,callback) => {callback(null,'uploads/')},
    filename: (req,file,callback) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        // console.log(uniqueName);
        callback(null,uniqueName);
    },

});

let upload = multer({storage,limit : {fileSize : 100000 * 100}}).single('myfile');

router.post('/',(req,res) => {
    
    //store file 
    upload(req,res, async (err) => {
        
        //validate request
        if (!req.file) {
            return res.json({
                error : "All fields are required."
            });
        }   
        
        if (err) {
            return res.status(500).send({errorMessage : err.message});
        }

        //store into database
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });

        const response  = await file.save();
        return res.json({file: `${APP_BASE_URL}/files/${response.uuid}`})

    });

    //reponse -> link 
});


router.post('/send',async (req,res) => {
    // console.log(req.body);
    const {uuid, emailTo, emailFrom} = req.body;
    // Validate Request
    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({error: 'All fields are required'});
    }

    //Get data from database
    const file = await File.findOne({uuid:uuid});
    if (file.sender) {
        return res.status(422).send({error: 'Email already send'});
    }

    file.sender = emailFrom;
    file.receiver = emailTo;

    const response = await file.save();

    //send email
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'inShare file sharing',
        text: `${emailFrom} shared the file with you.`,
        html: html({
            emailFrom: emailFrom,
            downloadLink: `${APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + ' KB',
            expires: '24 hours'
        })
    });

    return res.send({success: true});

});

export default router;
// module.exports = router;

