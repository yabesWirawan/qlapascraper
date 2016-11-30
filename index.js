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
var fs = require('fs')
var json2csv = require('json2csv')
var mime = require('mime')

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

var scrap = function (callback){
    // Do something ...
    request('https://qlapa.com/api/search?searchQuery='+req.param('search')+'&men=true&women=true&page=1&nonEtnik=false&etnik=false&priceMin=0&priceMax=99999999&sortMode=1&custom=false&child=false', function (err,resp,html){
        // Do something ...
        var json = JSON.parse(html)
        if(!err && resp.statusCode == 200){
            return callback(json)
        }
        // console.log(json)
    })
}

// static folder setup
app.use(express.static(path.join(__dirname, '/views')))
app.use('/styles', express.static(path.join(__dirname, '/public/css/')))

// all routes goes here
app.get('/', function(req, res){
    // Do Something...
    res.render('index', {
        title: 'Qlapa Web Scraper',
    })
})

app.get('/product/search', function(req, res){
    // Do Something...
    // console.log(req.param('search'))
    request('https://qlapa.com/api/search?searchQuery='+req.param('search')+'&men=true&women=true&page=1&nonEtnik=false&etnik=false&priceMin=0&priceMax=99999999&sortMode=1&custom=false&child=false', function (err,resp,html){
        // Do something ...
        var json = JSON.parse(html)
        if(!err && resp.statusCode == 200){
            res.render('search', {
                title: req.param('search'),
                data: json.items,
            })
        }
        // console.log(json)
    })
    
})

app.get('/convert', function(req, res){
    // Do Something...
    request('https://qlapa.com/api/search?searchQuery='+req.param('query')+'&men=true&women=true&page=1&nonEtnik=false&etnik=false&priceMin=0&priceMax=99999999&sortMode=1&custom=false&child=false', function (err,resp,html){
        // Do something ...
        var json = JSON.parse(html)
        if(!err && resp.statusCode == 200){
            json2csv({
                data: json.items,
                fields: ['itemId', 'title', 'shopName', 'minPrice', 'photoUrl', 'productDetailUrl', 'shopUrl']
            }, function (err,csv){
                // Do something ...
                if (err) throw err
                fs.writeFile('download.csv', csv, (err) => {
                if (err) throw err;
                    res.render('index',{
                        title: 'Qlapa Web Scraper',
                        message: "Your file has been sucessfully converted ..."
                    });
                });
            })
            
        }
        // console.log(json)
    })
})

app.get('/download', function(req, res){
    // Do Something...
    var file = __dirname + '/download.csv';

    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
})

// Do Something...

app.listen(3000, function(req, res){
    console.log('Listening at port 3000')
})