const {Router} = require('express')
const path = require('path')
const router = Router()
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const User = require('../models/user')
const nodemailer = require('nodemailer')
const greetings = require('../emails/greetings')
const sendgrid = require('nodemailer-sendgrid-transport')
const {signupValidation, validationLogin} = require('../validation/validAdd')
const {validationResult} = require('express-validator')
const keys = require('../keys')

// Nodemailer + sendGrid ------------------------------
const transport = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.API_EMAIL}
}))
// ----------------------------------------------------
path.dirname(__dirname)
router.get('/', (req, resp) => {
    resp.render('main_pages/account', {
        title: 'Authentication',
        isAuth: true,
        errorSignup: req.flash('errSignup'),
        errorLogin: req.flash('errLogin')
    })
})

router.post('/signup', signupValidation, async (req, resp) => {

    const error = validationResult(req)
    if(!error.isEmpty()) {
        req.flash('errSignup', error.array()[0].msg)
        resp.redirect('/account#signup')
    } else {
        const {name, email, password} = req.body
        const passwordBcrypt = await bcrypt.hash(password, 15)
        const user = new User({
            name, email, password: passwordBcrypt, cart: {items: []}
        })
        await user.save()
        resp.redirect('/account#login')
        await transport.sendMail(greetings(email))
    }
})

router.post('/login', validationLogin, async (req, resp) => {
    const error = validationResult(req)
    if(!error.isEmpty()) {
        req.flash('errLogin', error.array()[0].msg)
        resp.redirect('/account#login')
    } else {
        const user = await User.findOne({ email: req.body.email })
        req.session.authUser = true
        req.session.user = user
        req.session.save(err => {
            if(err) throw new Error(err)
            resp.redirect('/')
        })
    }
})

router.get('/signout', (req, resp) => {
    req.session.destroy(err => {
        if(err) throw new Error('Couldnt destroy storage')
        resp.redirect('/')
    })
})

router.get('/recover-password', (req, resp) => {
    resp.render('additional_pages/recover-password', {
        title: 'Recover password'
    })
})

router.post('/recover-password', (req, resp) => {
    crypto.randomBytes(68, async (err, buffer) => {
        if(err) {
            req.flash('errorRecover', 'Somethings wrong, try agine later')
            return resp.redirect('/account')
        }

        const user = await User.findOne({ email: req.body.email })
        const token = buffer.toString('hex')

        if(user) {
            user.resetToken = token
            user.resetTimeToken = Date.now() + (1000 * 60 * 60)
            await user.save()
            transport.sendMail()
        } else {

        }
    })
})

module.exports = router