require('dotenv').config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
const db = require('../models/index')
import _ from 'lodash';

const getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })

        } catch (e) {
            reject(e);
        }
    })
}

const getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: { exclude: ['password', 'image'] }
            })

            resolve({
                errCode: 0,
                data: doctors
            })

        } catch (e) {
            reject(e);
        }
    })
}

const saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {

                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    });
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })

                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        // doctorMarkdown.updateAt = new Date();

                        await doctorMarkdown.save();
                    }
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor succeed'
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

const getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    // Sử dụng include có tác dụng là : nó lấy thông tin của user và kèm theo thông tin của nó tồn tại trong Markdown
                    // Giống như nối 2 bẳng (join)               
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']

                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: false,
                    // nest: giúp code trả ra nó gọn chia các object
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

// Lưu lịch trình khám bệnh của bác sĩ xuống database
const bulkCreateSchedule = (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing param !'
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }



                // get all exsting data
                let existing = await db.Schedule.findAll(
                    {
                        where: { doctorId: data.doctorId, date: data.formatedDate },
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                        raw: true
                    }
                )


                // compare different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return +a.date === +b.date && a.timeType === b.timeType;
                });


                // create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);

                }

                resolve({
                    errCode: 0,
                    errMessage: 'Ok!'
                });
            }


        } catch (e) {
            reject(e)
        }
    })
}

const getScheduleDoctorByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [

                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: true,
                    nest: true
                })
                if (!dataSchedule) dataSchedule = [];

                resolve(
                    {
                        errCode: 0,
                        data: dataSchedule
                    }
                )
            }

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInforDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleDoctorByDate
}