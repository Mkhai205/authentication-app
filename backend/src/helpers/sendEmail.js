import nodeMailer from "nodemailer";
import handlebars from "nodemailer-express-handlebars";
import { fileURLToPath } from "node:url";
import path from "path";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @description This function sends an email using Nodemailer with Handlebars template engine.
 * @param {String} subject
 * @param {String} send_to
 * @param {String} sent_from
 * @param {String} reply_to
 * @param {String} template
 * @param {String} name
 * @param {String} link
 * @param {String} baseUrl - Base URL of your server for static assets
 * @returns {Promise<Object>}
 */
const sendEmail = async (
    subject,
    send_to,
    sent_from,
    reply_to,
    template,
    name,
    link,
    baseUrl = null
) => {
    let transporter;

    // Check which email service to use based on environment variables
    if (process.env.EMAIL_SERVICE === "gmail-oauth2") {
        // Gmail with OAuth2 (recommended for production)
        transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.USER_EMAIL,
                clientId: process.env.OAUTH_CLIENT_ID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            },
        });
    } else if (process.env.EMAIL_SERVICE === "gmail") {
        // Gmail with App Password (easier setup)
        transporter = nodeMailer.createTransport({
            service: "gmail",
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD, // This should be an App Password, not your regular password
            },
        });
    } else if (process.env.EMAIL_SERVICE === "smtp") {
        // Generic SMTP (for other providers like SendGrid, Mailgun, etc.)
        transporter = nodeMailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD,
            },
        });
    } else {
        // Default fallback to Gmail with app password
        transporter = nodeMailer.createTransport({
            service: "gmail",
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD, // This should be an App Password, not your regular password
            },
        });
    }

    const handlebarsOptions = {
        viewEngine: {
            extName: ".hbs",
            partialsDir: path.relative(__dirname, "../view"),
            defaultLayout: false,
        },
        viewPath: path.resolve(__dirname, "../view"),
        extName: ".hbs",
    };

    transporter.use("compile", handlebars(handlebarsOptions));
    const mailOptions = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        template: template,
        context: {
            subject: subject,
            name: name,
            link: link,
            baseUrl: baseUrl || process.env.SERVER_URL,
        },
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
};

export default sendEmail;
