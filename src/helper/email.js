const { appConfig } = require('../config/appConfig');
const nodemailer = require('nodemailer');
const fs = require('fs')
const path = require('path')

async function sendSMTPEmail(data){
   
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: 'prasanthsathasivam2001@gmail.com',
                pass: 'lwaqbflqljarbsld' // naturally, replace both with your real credentials or an application-specific password
            }
        });
        let mailOption = {
            from: 'prasanthsathasivam2001@gmail.com',
            to: data.email,
            subject: 'payment invoice',
            html: await template(data),
            attachments: [
                {
                    filename:data.fileName,
                    path:path.join(__dirname,data.fileName),
                    contentType:'application/pdf'
                }
            ]
        }
       
        transporter.sendMail(mailOption, function (err, info) {
            if (err) {
                console.log(err);
                return err;
            } else {
                return true;
            }
        });
    } catch (error) {
        console.log(error);
        throw error
    }
};

function template(mailData){
    let html = `

    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title>Email success pdf</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    
        <link rel="stylesheet" href="style.css">
    
        <style>
            a.common-btn {
                padding: 20px 56px;
                width: fit-content;
                background: #B89F54;
                color: #fff;
                border-radius: 50px 50px 0 50px;
            }
    
            .email-pdf-page-outer {
                background: #fff;
                box-shadow: 0 0 20px 0 #efefef;
                margin: 30px auto;
            }
    
            .email--success-pdf-page-inner {
                padding: 30px 30px 50px 30px;
            }
    
            .email-pdf-page-outer .email-pdf-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }
    
            .email-pdf-page-outer .email-pdf-header .contact-info {
                width: auto;
            }
    
            .email-pdf-deatils {
                display: flex;
                justify-content: space-between;
            }
    
            .message p {
                text-align: left;
            }
    
            .message {
                text-align: center;
            }
        </style>
    
    </head>
    
    <body>
    
        <div class="email-pdf-page-outer container">
    
            <div class="email--success-pdf-page-inner">
                <div class="email-pdf-header">
                    <div class="contact-info">
                        <p>Jairams Arts and Science College<br> Karur Attampparappu</p>
                        <p>M : 9952410253 | 7708061799</p>
                        <p>E : jairams.karur@gmail.com</p>
                    </div>
                </div>
    
                <hr>
                <br>
    
                <div class="message">
                    <p>Dear ${mailData.name},</p>
                    <p>We hope this message finds you well. We would like to express our gratitude for your recent payment
                        of ${mailData.paided_fees} towards your fees, which has been successfully received and processed.</p>
                    <p>While we appreciate your effort in clearing a portion of your outstanding fees, we would like to
                        remind you that there is a remaining balance of ${mailData.pending_fees}. To ensure a smooth continuation of your
                        academic journey, we kindly request you to settle the pending amount at your earliest convenience.
                    </p>
                    <p>
                        Thank you for your prompt attention to this matter, and we look forward to your continued
                        cooperation.
                    </p>
                    <p>Best regards,</p>
                    <p>Jairams Arts and Science College<br> Karur, Attampparappu</p>
                    <br>
                    <br>
                </div>
    
            </div>
        </div>
    
    
    
    </body>
    
    </html>`

    return html
}

module.exports = {
    sendSMTPEmail:sendSMTPEmail
}