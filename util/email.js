const nodemailer = require('nodemailer');


const sendEmail = async (email,subject,text)=>{
    try{
        const transporter= nodemailer.createTransport({
            host:process.env.HOST,
            service:process.env.SERVICE,
            port:587,
            secure:true,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASSWORD
            }
        })
        await transporter.sendMail({
            from:process.env.MAIL_USER,
            to:email,
            subject,
            text
        })
    }catch(err){
        console.log(err)
    }
}

module.exports = sendEmail;