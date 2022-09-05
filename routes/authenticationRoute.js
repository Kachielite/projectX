const express = require('express');
const {body} = require('express-validator');
const User = require('../model/user');
const authenticationController = require('../controllers/authenticationController')

const route = express.Router();

route.put('/register', [
    body('username')
        .not().isEmpty().withMessage('Username can not be empty')
        .not().isLength({min: 4}).withMessage('Username must be at least 4 characters long')
        .custom((value, {req}) =>{
            return User.findOne({username: value}).then(userDoc => {
                if(userDoc){
                    return Promise.reject('Username already exist')
                }
            })
        }),
    body('email')
        .not().isEmail().withMessage('Invalid email, please provide a valid email')
        .isEmpty().withMessage('Email can not be empty')
        .custom((value,{req}) =>{
            return User.findOne({email: value}).then(userDoc =>{
                if(userDoc){
                    return Promise.reject('Email already exist')
                }
            })
        })
        .normalizeEmail(),
    body('password')
        .isEmpty().withMessage('Password can not be empty')
        .not().isLength({min: 6}).withMessage('Password must be at least 6 characters long')
        .trim(),
    body('confirmPassword')
        .custom((value, {req}) =>{
            if(value !== req.body.confirmPassword){
                return Promise.reject('Passwords do not match, please check and try again')
            }
        }),
    body('business_name')
        .isEmpty().withMessage('Business name can not be empty')
        .trim()
    
], authenticationController.register)

module.exports = route;