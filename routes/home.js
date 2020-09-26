const {Router} = require('express')
const router = Router()

router.get('/', (req, resp) => {
    resp.render('main_pages/home', {
        title: 'Home page',
        isHome: true
    })
})

module.exports = router