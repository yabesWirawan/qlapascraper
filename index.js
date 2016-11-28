/*
App structure
|-controller
|--dataquery.js
|-node_modules
|-public
|--css
|---master.css
|-views
|--layouts
|---main.hbs
|--index.hbs
|-index.js
|-package.json
*/
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var sessions = require('express-session')
var hbs = require('express-handlebars')
var request = require('request')

var app = express()
var router = express.Router()

// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// view engine setup
app.engine('hbs', hbs({extname: '.hbs', defaultLayout: 'main', layoutDir: path.join(__dirname, '/views/layouts')}))
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', '.hbs')

var session

// static folder setup
app.use(express.static(path.join(__dirname, '/views')))
app.use('/styles', express.static(path.join(__dirname, '/public/css/')))

// all routes goes here
app.get('/', function(req, res){
    // Do Something...
    res.render('index', {
        title: 'Qlapa Web Scrapper',
    })
})

app.get('/about', function(req, res){
    // Do Something...
    res.render('about', {
        title: 'About Us',
        data: ['test1', 'test2', 'test3']
    })
})

app.get('/product/search', function(req, res){
    // Do Something...
    // console.log(req.param('search'))
    request('https://qlapa.com/api/search?page=2&searchQuery='+req.param('search')+'&men=true&women=true&page=1&nonEtnik=false&etnik=false&priceMin=0&priceMax=99999999&sortMode=1&custom=false&child=false', function (err,resp,html){
        // Do something ...
        var json = JSON.parse(html)
        if(!err && resp.statusCode == 200){
            res.send(json.items)
        }
    })
})

// app.get('/product/search/:term', function(req, res){
//     // Do Something...
//     console.log(req.params.term)
// })

// Do Something...

app.listen(3000, function(req, res){
    console.log('Listening at port 3000')
})