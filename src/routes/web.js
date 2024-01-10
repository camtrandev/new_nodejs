const express = require('express');
const {
  getHomePage,
  getCrud,
  postCrud,
  displayGetCrud,
  getEditCrud,
  putCrud,
  deleteCrud,
}
  = require('../controllers/homeController')

// import file Usercontroller dùng sử lý APi, liên quan đến người dùng thì cho vào controller
const {
  handleLogin,
  handleGetAllUser,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode

} = require('../controllers/userController');
const {
  getTopDoctorHome,
  getAllDoctor,
  postInforDoctor,
  getDetailDoctorById
} = require('../controllers/doctorController');
const router = express.Router();

let initWebroutes = (app) => {

  router.get('/', getHomePage);
  router.get('/crud', getCrud);
  router.post('/post-crud', postCrud);
  router.get('/get-crud', displayGetCrud);
  router.get('/edit-crud', getEditCrud);
  router.post('/put-crud', putCrud);
  router.get('/delete-crud', deleteCrud);

  // API
  router.post('/api/login', handleLogin);
  router.get('/api/get-all-user', handleGetAllUser);
  router.post('/api/create-new-user', handleCreateNewUser);
  router.put('/api/edit-user', handleEditUser);
  router.delete('/api/delete-user', handleDeleteUser);

  // Viết API allcode để lấy ROle để phân quyền người dùng

  router.get('/api/allcode', getAllCode);
  router.get('/api/top-doctor-home', getTopDoctorHome);

  // lấy thông tin Bác Sĩ
  router.get('/api/get-all-doctors', getAllDoctor);
  // luu thong tin bac si
  router.post('/api/save-infor-doctors', postInforDoctor);
  router.get('/api/get-detail-doctor-by-id', getDetailDoctorById);

  return app.use("/", router);
}

module.exports = initWebroutes;