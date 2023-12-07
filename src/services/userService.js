
// trong file này dùng để sử lý logic của phần đăng nhập user

const express = require('express')
const db = require('../models/index')
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);


const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            // check email
            let isExist = await checkUserEmail(email);
            if (isExist) {
                // user already exist
                // compare password

                // kiểm tra passwork
                let user = await db.User.findOne({
                    // email thứ 2 là email mà người dùng chuyền vào để check trong db
                    where: { email: email },
                    // cần phải raw để ẩn bớt mấy cái râu ria thì mới có thể ẩn password đi được  
                    raw: true,
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'] // những trường mà mình muốn sâu ra
                    // nếu không muốn xâu cái password ra màn hình thì hãy tra gg :"lm thế nào để delete 1 thuộc tính của 1 javascript object"
                })
                if (user) {
                    let checkPasswork = await bcrypt.compareSync(password, user.password);
                    if (checkPasswork) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok!';
                        // cách xóa 1 thuộc tính từ javascript object
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong Password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found `
                }


            } else {
                // return error
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exsit in your system. plaese try other email `
            }

            resolve(userData);

        } catch (e) {
            reject(e)
        }
    })
}
// login kiểm tra xem useremail đã có trong hệ thong chưa 
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
                raw: true
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }

        } catch (e) {
            reject(e);
        }
    })
}

const getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'All') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'All') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']

                    }
                })
            }
            resolve(users)

        } catch (error) {
            reject(errror);
        }
    })
}

// APi tao moi User
const createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email có tồn tại hay không 
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: "Your email is alresdy in used, plz try another email"
                })
            }
            if (!(check === true)) {

                let hashPasswordFormBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFormBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNmuber: data.phoneNmuber,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleId
                });
                // trả về 1 chuối messgae -- tương đương với câu lênh return
                resolve({
                    errCode: 0,
                    message: 'ok!'
                })
            }

        } catch (e) {
            reject()
        }
    })
}
// API delete user
const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: false
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't exist`
                })
            }
            await user.destroy();
            resolve({
                errCode: 0,
                errMessage: `Delete success!`
            })
        } catch (e) {
            reject(e);
        }

    })
}

const upDateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    message: "missing required parameters"
                })
            }

            // chọc vào dataBasc tham chiếu đến User để upDate dữ liệu mới 
            // Và cần phải biết Id của thằng user mới update được
            let user = await db.User.findOne({
                // tìm id trong db trùng với id mà mình chuyền vào
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.lastName = data.lastName;
                user.firstName = data.firstName;
                user.address = data.address;

                // luu thong tin vua thay doi
                await user.save();
                resolve({
                    errCode: 0,
                    message: "UpDate the user succeds!"
                })
            } else {
                resolve({
                    errCode: 1,
                    message: "User not found!"
                })
            }

        } catch (e) {

        }
    })
}

/**
 * viết API để lấy ra role (phân quyền người dùng)
 */

const getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(typeInput)
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Maissing required parmeters!'
                })
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res)
            }

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    deleteUser,
    upDateUserData,
    getAllCodeService
}