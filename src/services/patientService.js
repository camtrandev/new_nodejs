require('dotenv').config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
const db = require('../models/index')
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
const {
    sendSimpleEmail
} = require('./emailService')

let buildUrlEmail = (doctorId, token) => {

    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`

    return result;
}


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

                let token = uuidv4();

                await sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.String,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
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
                            timeType: data.timeType,
                            token: token
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

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    erCode: 1,
                    errMessage: 'Missing parameter!!'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        erCode: 0,
                        errMessage: "Update the appointment succeed!"
                    })
                } else {
                    resolve({
                        erCode: 2,
                        errMessage: "Appointment schedule has been activated or does not exist!"
                    })
                }
            }

        } catch (e) {
            console.log("Error:   ", e);
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointment,
    postVerifyBookAppointment
}