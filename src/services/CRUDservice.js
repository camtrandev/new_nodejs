
const bcrypt = require('bcryptjs');
const db = require('../models/index');


const salt = bcrypt.genSaltSync(10);

// tạo user từ form 
const createNewUser = async (data) => {

    return new Promise(async (resolve, reject) => {
        try {
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
            resolve('ok create a new user succeed');
        } catch (e) {
            reject(e)
        }
    })

}

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

// lấy thông tin người dùng
const getAllUser = () => {
    // Promise dùng để sử lý bất đông bộ , được hiểu là nó sẽ chạy xong thằng promise rồi mới đến thằng tiếp theo
    // resolve là chấp nhận còn reject là từ chối
    return new Promise(async (resolve, reject) => {
        try {
            // Dùng db để tham chiếu đến các table bằng cách db.modelName trong từng models 
            // chuyền vào trong findAll 1 cái array  để lấy ra tất cả dữ liệu gốc 
            let users = db.User.findAll({
                raw: true,
            });
            // để thoát khỏi promise ta dùng resolve nó tương đương với return 
            resolve(users)

        } catch (e) {
            reject(e);
        }
    })
}

//lấy dữ liệu người dùng từ id (check Id)
const getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true
            })
            if (user) {
                resolve(user)
            } else {
                resolve({})
            }

        } catch (e) {
            reject(e)
        }
    })
}

// Hàm thực thi khi ấn vào nút Update để chỉnh sửa user
const upDateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
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

                let allUsers = await db.User.findAll();

                resolve(allUsers);
            } else {
                resolve(" No have users")
            }

        } catch (e) {
            reject(e);
        }
    })
}

const deleteUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id },
                raw: false
            })
            if (user) {
                await user.destroy();
            }

            resolve();

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createNewUser,
    getAllUser,
    getUserInfoById,
    upDateUserData,
    deleteUserById
}