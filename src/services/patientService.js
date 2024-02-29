require('dotenv').config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
const db = require('../models/index')
import _ from 'lodash';

const {
    sendSimpleEmail
} = require('./emailService')


const postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date
                || !data.fullName
            ) {
                resolve({
                    erCode: 1,
                    errMessage: 'Missing parameter!!'
                })
            } else {


                await sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.String,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: 'https://www.facebook.com/thanh.stat/'
                })



                //upsert 
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    default: {
                        email: data.email,
                        roleId: 'R3'
                    }
                });

                //Create table Booking
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType
                        }

                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Success'
                })
            }

        } catch (e) {
            reject(e);
            console.log("Error:  ", e);
        }
    })
}

module.exports = {
    postBookAppointment
}