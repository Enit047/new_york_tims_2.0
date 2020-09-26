const express = require('express')
const path = require('path')
const hbs = require('express-handlebars')
const app = express()
const mondoose = require('mongoose')
const csrf = require('csurf')
const localVariables = require('./middlewares/localVariables')
const flash = require('connect-flash')
const session = require('express-session')

const keys = require('./keys')

// Connect session ----------------------------
const MongodbStoreConnnect = require('connect-mongodb-session')(session)
const sessionStore = new MongodbStoreConnnect({
    collection: 'sessions',
    uri: keys.URL_CONECTION
})
// --------------------------------------------

// Add handlebars --------------------------
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'index'}))
app.set('view engine', 'hbs')
app.set('views', 'pages')
// -----------------------------------------

// Static ----------------------------------
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded())
app.use(session({
    secret: keys.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore 
}))
app.use(flash())
app.use(csrf())
app.use(localVariables)
// -----------------------------------------

// Middlewares -----------------------------

// -----------------------------------------

// Routes ----------------------------------
    // Import routes ---------------
    const home = require('./routes/home')
    const movies = require('./routes/movies')
    const add = require('./routes/add')
    const account = require('./routes/account')
    // -----------------------------
app.use('/', home)
app.use('/movies', movies)
app.use('/add', add)
app.use('/account', account)
// -----------------------------------------

async function start() {
    await mondoose.connect(keys.URL_CONECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log('listening..')
    })
}
start()