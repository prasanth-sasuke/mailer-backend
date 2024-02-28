const e = require("express");
const { default: puppeteer } = require("puppeteer");
const { appConfig } = require("../config/appConfig");

function generateHTML(users) {
    try {
        const invoice = users.map(user => `
        <div class="email-pdf-page-outer container">
    
        <div class="email-pdf-page-inner">
            <div class="email-pdf-header">
                <img src=${appConfig.logo}>
                <div class="contact-info">
                    <p>Jairams Arts and Science College<br> Karur Attampparappu</p>
                    <p>M : 9952410253 | 7708061799</p>
                    <p>E : jairams.karur@gmail.com</p>
                </div>
            </div>
    
            <hr>
            <br>
    
            <div class="email-pdf-deatils">
                <div class="student-deatils">
                    <p><strong>Name:</strong> ${capitalizeFirstLetter(user.name)}</p>
                    <p><strong>Branch:</strong> ${user.department}</p>
                    <p><strong>Semester:</strong> ${user.semster} </p>
                </div>
                <div class="name">
                    <p><strong>Date:</strong> ${new Date().toISOString().split('T')[0]}</p>
                    <p><strong>Roll No:</strong> ${user.registerNumber}</p>
                    <p><strong>Email ID:</strong> ${user.email} </p>
                </div>
    
            </div>
    
            <br>
    
            <div class="fees-deatils-outer">
                <div class="total-fees">
                    <div class="fees-title">
                        <h6 class="Particulars">Particulars</h6>
                        <h6 class="Amount">Amount</h6>
                    </div>
                    <div class="fees-deatils">
                        <p class="Particulars">Total Fee</h6>
                        <p class="Amount">${user.fees}</h6>
                    </div>
                    <div class="fees-deatils">
                        <p class="Particulars">Paid Fee</h6>
                        <p class="Amount">${user.paided_fees}</h6>
                    </div>
                    <hr>
                    <div class="fees-deatils">
                        <p class="Particulars">Balance Fee</h6>
                        <p class="Amount">${user.pending_fees}</h6>
                    </div>
                </div>
    
            </div>
        </div>
    
        <br>
    </div>
    
        `);
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <title>Email pdf page</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
        
            <link rel="stylesheet" href="style.css">
        
            <style>
                .email-pdf-page-outer {
                    background: #fff;
                    box-shadow: 0 0 20px 0 #efefef;
                    margin: 30px auto;
                }
        
                .email-pdf-page-inner {
                    padding: 30px 30px 0 30px;
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
        
                .fees-title {
                    background: #EFEEED;
                    display: flex;
                    align-items: center;
                    padding: 12px 20px;
                }
        
                .fees-title h6 {
                    margin: 0;
                }
        
                .Particulars {
                    width: 70%;
                }
        
                .Amount {
                    width: 30%;
                }
        
                .fees-deatils {
                    display: flex;
                    align-items: center;
                    padding: 20px 20px 20px;
                }
        
                .fees-deatils p {
                    margin-bottom: 0;
                }
        
                .notes {
                    display: flex;
                    justify-content: space-between;
                    background: #333;
                    padding: 10px 20px;
                }
        
                .notes p,
                .notes strong {
                    color: #fff;
                    margin: 0;
                }
            </style>
        </head>
        <body>
                ${invoice}
        </body>
        </html>
        `;
        return html;
    } catch (error) {
        console.log(error);
        throw error
    }
  
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


async function capturePDF(htmlContent) {
    let puppeteer = require("puppeteer")
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();
        return pdf;
    } catch (error) {
        console.log(error);
        throw error
    }
   
  }
  

module.exports = {
    generateHTML: generateHTML,
    capturePDF:capturePDF
}