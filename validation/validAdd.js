const {body} = require('express-validator')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.validationAdd = [
    body('title').isLength({min: 10, max: 200}).withMessage('Minimum length of title is 10 characters, maximum is 200 characters'),
    body('description').isLength({min: 50, max: 2000}).withMessage('Minimum length of description is 50 characters, maximum is 2000 characters'),
    body('rating').custom((value, {req}) => {
        if(+value > 10) {
            throw new Error('Rating cant be more then 10')
        } else if(value.length === 2 && +value === 0) {
            throw new Error('You cant write two zero')
        }
        return true
    }),
    body('price').isNumeric().withMessage('Price is number').isLength({max: 6}).withMessage('Max price 999999$'),
    body('img_url', 'With your URL is something wrong').isURL()
]

exports.signupValidation = [
    body('name').isLength({min: 4}).withMessage('Name must be more 3 characters').custom( async (value, {req}) => {
        const user = await User.findOne({ email: value })
        if(user) {
            throw new Error('Email already exists')
        } else {
            return true
        }
    }),
    body('email').isEmail().withMessage('With your email something wrong'),
    body('password').isLength({min: 6, max: 52}).withMessage('Your password should be longer then 6 characters').isAlphanumeric().withMessage('Password have to contain letters and numbers'),
    body('confirm_password').custom((value, {req}) => {
        if(value === req.body.password){
            return true
        } else {
            throw new Error('Passwords doesnt compare')
        }
    })
]

exports.validationLogin = [
    body('email').custom( async (value, {req}) => {
        const user = await User.findOne({
            email: value
        })

        if(user){
            const password = await bcrypt.compare(req.body.password, user.password)
            if(!password) {
                throw new Error('You have entered an invalid email or password')
            }

            return true
        } else {
            throw new Error('You have entered an invalid email or password')
        }
    })
]