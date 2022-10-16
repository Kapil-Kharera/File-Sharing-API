import dotenv from 'dotenv';

dotenv.config();

export  const {
    APP_PORT,
    MONGO_CONNECTION_URL,
    APP_BASE_URL,
    SMTP_HOST,
    SMTP_PORT,
    MAIL_USER ,
    MAIL_PASS,
    ALLOWED_CLIENTS
} = process.env;