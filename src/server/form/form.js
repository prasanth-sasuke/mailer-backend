const executeMethod = require("../../db/mysql.js");
const { success, error } = require('../../helper/response.js');
const bill = require('../../helper/bill.js');
const { sendSMTPEmail } = require('../../helper/email.js')
let fs = require('fs');
const { appConfig } = require("../../config/appConfig.js");


const getDepartMent = async (req, res) => {
    try {
        let data = req.params;
        let userId = req.params.userId

        if (!data || !userId) {
            let result = error('Invalid data!', 400);
            return res.status(400).send(result);
        }
        let department = await executeMethod(`SELECT * from clgdepartment where userId = ${userId}`);
        if (department.length > 0) {
            let result = success('ok', department, 200)
            return res.status(200).send(result)
        } else {
            let result = error('No department found.', 404);
            return res.status(404).send(result);
        }
    } catch (err) {
        console.log(err);
        let result = error(err, 404);
        return res.status(404).send(result);
    }
}

const createStudent = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.name || !data.gender || !data.date_of_birth || !data.email ||!data.department_id|| !data.address || !data.phone_number || !data.department || !data.semster) {
            let result = error('Invalid data!', 400);
            return res.status(400).send(result);
        }
        // let department_id = data.department == "BCA" ? 1 : 2;
        let studentData = await executeMethod(`
                SELECT * FROM student WHERE email = ?`, [data.email]);
        if (studentData.length === 0) {
            await executeMethod(`
                    INSERT INTO student(name, gender, date_of_birth,email,address,phone_number,department,semster,department_id,fees) 
                    VALUES (?, ?, ?,?,?,?,?,?,?,?)`, [data.name, data.gender, data.date_of_birth, data.email, data.address, data.phone_number, data.department, data.semster, data.department_id, appConfig.fee]);
                    let result = success('Student Created Successfully!', 200);
                    return res.status(200).send(result);
                } else {
            let result = error('Email id already exists!.', 404);
            return res.status(404).send(result);
        }
    } catch (err) {
        console.log(err);
        let result = error(err, 404);
        return res.status(404).send(result);
    }
}

const getStudentByDepartId = async (req, res) => {
    try {
        let data = req.params;
        let id = req.params.id

        if (!data || !id) {
            let result = error('Invalid data!', 400);
            return res.status(400).send(result);
        }
        let students = await executeMethod(`SELECT * from student where department_id = ${id}`);
        if (students.length > 0) {
            let result = success('ok', students, 200)
            return res.status(200).send(result)
        } else {
            let result = error('No department found.', 404);
            return res.status(404).send(result);
        }
    } catch (err) {
        console.log(err);
        let result = error(err, 404);
        return res.status(404).send(result);
    }
}

const getStudentById = async (req, res) => {
    try {
        let data = req.params;
        let id = req.params.id

        if (!data || !id) {
            let result = error('Invalid data!', 400);
            return res.status(400).send(result);
        }
        let students = await executeMethod(`SELECT * from student where id = ${id}`);
        console.log(students);
        if (students.length > 0) {
            let result = success('ok', students, 200)
            return res.status(200).send(result)
        } else {
            let result = error('No department found.', 404);
            return res.status(404).send(result);
        }
    } catch (err) {
        console.log(err);
        let result = error(err, 404);
        return res.status(404).send(result);
    }
}

const paidFees = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.id || !data.paidFees) {
            let result = error('Invalid data!', 400);
            return res.status(400).send(result);
        }
        let checkStudentFees = await executeMethod(`
        SELECT * FROM student WHERE id = ?`, [data.id]);

        if (checkStudentFees.length > 0) {
            //fee
            let feesData = checkStudentFees[0];
            let paid_fee = parseInt(feesData.paided_fees) + parseInt(data.paidFees);
            let balanceFees = feesData.fees - data.paidFees;
            feesData.paided_fees = data.paidFees;
            feesData.pending_fees = balanceFees
            let htmlContent = await bill.generateHTML([feesData]);
            let pdf = await bill.capturePDF(htmlContent);

            //stored in local path
            const fileName = `${new Date().getTime()}.pdf`;
            feesData.fileName = fileName
            fs.writeFileSync(`C:\\Users\\Codenatives\\Desktop\\dragAnddrop\\mailer\\backend\\src\\helper\\${fileName}`, pdf);

            //sendMail
            let sendMail = sendSMTPEmail(feesData)

            let update = await executeMethod(`UPDATE student SET paided_fees = ?, pending_fees = ?, invoice =? WHERE id=${data.id}`,
                [paid_fee, balanceFees, "invoice"]
            )
            let result = success('Fee paid successfully!', 200);
            return res.status(200).send(result);

        } else {
            let result = error('Student not found', 409);
            return res.status(409).send(result);
        }
    } catch (err) {
        console.error('Error in paidFees:', err);
        let result = error('Internal server error', 500);
        return res.status(500).send(result);
    }
}

module.exports = {
    getDepartMent: getDepartMent,
    getStudentByDepartId: getStudentByDepartId,
    getStudentById: getStudentById,
    paidFees: paidFees,
    createStudent: createStudent
}