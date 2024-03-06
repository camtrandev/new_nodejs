const db = require("../models")



let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.name || !data.imageBase64 || !data.descriptionMarkdown || !data.descriptionHTML) {
                resolve({
                    erCode: 1,
                    errMessage: 'Missing parameter!!'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }
        } catch (e) {
            console.log("Error:    ", e)
            reject(e);

        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: "Ok",
                data
            })

        } catch (e) {
            console.log("Error:    ", e);
            reject(e);
        }
    })
}

module.exports = {
    createNewSpecialty,
    getAllSpecialty
}