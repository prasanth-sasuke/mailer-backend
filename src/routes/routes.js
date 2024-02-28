const express =require("express");

const router = express.Router()
 const formController = require('../server/form/form.js');
 const userController = require('../server/user/user.js')

router.get('/getDepartment/:userId',formController.getDepartMent);
router.get('/getStudent/:id',formController.getStudentById);
router.get('/getStudentByDepartId/:id',formController.getStudentByDepartId);
router.post('/payFees',formController.paidFees);
router.post('/createStudent',formController.createStudent);

router.post('/signup',userController.userSignUp);
router.post('/signin',userController.userLogin);

module.exports = router;
