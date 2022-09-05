const User = require('../model/user');
const bycrypt = require('bcryptjs')
const {validationResult} = require('express-validator');

exports.register = async (req, res, next) =>{

    let businessName = req.body.business_name
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let error = new Error('Invalid User Input');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {
        const hashPassword = await bycrypt.hash(password, 12);

        let user = new User();
        user.business_name = businessName;
        user.email = email;
        user.username = username;
        user.password = hashPassword;

        await user.save();

        return res.statusCode(201).json({message: 'User successful created'})
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500
        }
        next(error)
    }

}