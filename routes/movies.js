const {Router} = require('express')
const Movies = require('../models/addMovie')
const {validationResult} = require('express-validator')
const {validationAdd} = require('../validation/validAdd')
const router = Router()

router.get('/', async (req, resp) => {
    const movies = await Movies.find().lean()
    resp.render('main_pages/movies', {
        title: 'Movies page',
        isMovies: true,
        movies: movies
    })
})

router.get('/:id', async (req, resp) => {
    const movie = await Movies.findById(req.params.id).lean()
    resp.render('additional_pages/inf_movie', {
        title: 'Information about card',
        movie
    })
})

router.get('/:id/edit', async (req, resp) => {
    if(!req.query.allow){
        return resp.redirect('/movies')
    }

    const movie = await Movies.findById(req.params.id).lean()
    resp.render('additional_pages/edit_movie', {
        title: 'Edit movie',
        movie
    })
})

router.post('/edit', validationAdd, async (req, resp) => {
    const error = validationResult(req)
    if(!error.isEmpty()) {
        console.log(error.array())
        resp.render('additional_pages/edit_movie', {
            title: 'Edit movie',
            movie: req.body,
            error: error.array()[0].msg
        })
    } else {
        await Movies.findByIdAndUpdate(req.body.id, req.body)
        resp.redirect('/movies')
    }
    
})

router.post('/delete', async (req, resp) => {
    await Movies.findOneAndDelete({
        _id: req.body.id
    })
    resp.redirect('/movies')
})


module.exports = router