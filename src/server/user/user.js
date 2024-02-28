const bcrypt = require('bcrypt');
const executeMethod = require("../../db/mysql");
const { success, error } = require('../../helper/response.js');

const userSignUp = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.name || !data.email || !data.password) {
            let result = error('Invalid data!', 400);
            return res.status(400).send(result);
        }

        try {
            let checkEmail = await executeMethod(`
                SELECT * FROM user WHERE email = ?`, [data.email]);

            if (checkEmail.length === 0) {
                const hashedPassword = await bcrypt.hash(data.password, 10);
                console.log(hashedPassword);
                await executeMethod(`
                    INSERT INTO user(name, email, password) 
                    VALUES (?, ?, ?)`, [data.name, data.email, hashedPassword]);

                let userData = {
                    name: data.name,
                    email: data.email
                };
                let result = success('User created successfully!', userData, 200);
                return res.status(200).send(result);
            } else {
                let result = error('Email already exists.', 409);
                return res.status(409).send(result);
            }
        } catch (err) {
            console.error('Error in executeMethod:', err);
            let result = error('Internal Server Error', 500);
            return res.status(500).send(result);
        }
    } catch (err) {
        console.error('Error in executeMethod:', err);
        let result = error('Internal Server Error', 500);
        return res.status(500).send(result);
    }
};

const userLogin = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.email || !data.password) {
            let result = error('Invalid data!', 400);
            return res.status(400).send(result);
        }

        // Check if the email exists
        let userData = await executeMethod(`
                SELECT * FROM user WHERE email = ?`, [data.email]);

        if (userData.length === 1) {
            // const isPasswordValid = await bcrypt.compare(data.password, userData[0].password);
            let isPasswordValid = data.password == userData[0].password ? true : false;
            if (isPasswordValid) {
                let result = success('Login Successfully!', userData[0], 200);
                return res.status(200).send(result);
                
            } else {
                // Password is incorrect
                let result = error('Invalid password.', 401);
                return res.status(401).send(result);
            }
        } else {
            let result = error('User not found.', 404);
            return res.status(404).send(result);
        }
    } catch (err) {
        console.error('Error in userLogin:', err);
        let result = error('Internal Server Error', 500);
        return res.status(500).send(result);
    }
};

module.exports = {
    userSignUp: userSignUp,
    userLogin: userLogin
};
