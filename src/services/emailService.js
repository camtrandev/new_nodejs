require('dotenv').config();
import nodemailer from 'nodemailer'

let sendSimpleEmail = async (dataSend) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_PASSWORD,
        },
    });


    let info = await transporter.sendMail({
        from: '"Cầm trần 👻" <camtm2004@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám ✔", // Subject line
        html:
            getBodyHtmlEmail(dataSend)
        ,
    });
}

let getBodyHtmlEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
         <h3>Xin chào ${dataSend.patientName}</h3>
         <p>Email này thông báo bạn đã đặt lịch online trên App đặt lịch</p>
         <p>Thông tin đặt lịch khám bệnh: </p>
         <div><b>Thời gian: ${dataSend.time}</b></div>
         <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
         <div>Vui lòng đọc kĩ thông tin và Click vào đường link để xác nhận lịch hẹn khám bệnh: </div>
         <div>
           <a href=${dataSend.redirectLink} target="_blank">Click here</a>
         </div>
         <div> Xin chân thành cảm ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
         <h3>Dear ${dataSend.patientName}</h3>
         <p>Email 
This email notifies you that you have booked an online appointment on the scheduling App</p>
         <p>Information on scheduling medical examinations: </p>
         <div><b>Time: ${dataSend.time}</b></div>
         <div><b>Doctor: ${dataSend.doctorName}</b></div>
         <div>
Please read the information carefully and click on the link to confirm your medical appointment: </div>
         <div>
           <a href=${dataSend.redirectLink} target="_blank">Click here</a>
         </div>
         <div> Thank you!</div>
        `
    }
    return result;
}



module.exports = {
    sendSimpleEmail: sendSimpleEmail
}
