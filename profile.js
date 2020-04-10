var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timelog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
})

// define the home page route
router.get('/', function (req, res){
    res.send('Hello World')
})

// define the about route
router.get('/about', function (req, res){
    re.send('About me')
})

module.exports = router