var express = require('express');
var session = require ('express-session');
var crypto = require('crypto');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(typeof req.session.email === "undefined")
    {
        res.redirect('/login');
    } else {
        res.render('index.ejs', {
            name: req.session.email,
            sessionId: req.session.sid
        });
    }
});

router.get('/login',function(req,res){
    res.render('login');
});

router.get('/logout',function(req,res){
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

router.post('/login',function(req,res){
    req.session.email = req.body.email;
    req.session.sid = crypto.createHmac(nconf.get('session:algorithm'), nconf.get('session:secret'))
        .update(req.body.email + (new Date()).getMilliseconds())
        .digest('hex');
    res.redirect('/');
});

module.exports = router;
