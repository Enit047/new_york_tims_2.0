const {Router} = require('express')
const router = Router()
const AddModel = require('../models/addMovie')
const {validationResult} = require('express-validator')
const {validationAdd} = require('../validation/validAdd')

router.get('/', (req, resp) => {
    resp.render('main_pages/add', {
        title: 'Add page',
        isAdd: true
    })
})

router.post('/', validationAdd, async (req, resp) => {
    const { title, description, rating, price, img_url } = req.body

    const error = validationResult(req)
    if(!error.isEmpty()) {
        resp.render('main_pages/add', {
            title: 'Add page',
            isAdd: true,
            error: error.array()[0].msg,
            data: req.body
        })
    } else {
        const movie = new AddModel({ title, description, rating, price, img_url })
        await movie.save()
        resp.redirect('/movies')
    }
})

module.exports = router