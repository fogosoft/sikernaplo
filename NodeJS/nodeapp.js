var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var http = require('http');
var util = require('util');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var nodemailer = require("nodemailer");

var Env = require('./env');

var transport = nodemailer.createTransport("SMTP", {
    host: "?", // hostname
    port: 25, // port for secure SMTP
    auth: {
        user: "?",
        pass: "?"
    }
});

mongoose.connect(Env.mongodb_st);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback() {
    console.log("Connected to mongo :" + Env.mongodb_st);
});

app.configure(function() {
    app.use(express.static('public'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({
        secret: 'aamtech1234',
        cookie: {maxAge: 10 * 60 * 1000} //10 perc session timeout
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});

var Account = require('./models/accounts');

passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(function(user, done) {
    // console.log("serial hiv");
    //done(null, user.username);
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    // console.log("deserial hiv:" + user);
    Account.findOne({username: user.username}, function(err, user) {
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
    clientID: '262128657326475',
    clientSecret: '05aa7be515e5e6eb31480845807a2278',
    callbackURL: "http://www.proudlog.com/testsikerBE/fbauth/callback"
},
function(accessToken, refreshToken, profile, done) {

    console.log("FB check");
    console.log(profile);

    Account.find({'provider_id': profile.id, 'provider': 'facebook'}, function(err, olduser) {

        //console.log("HIba:"+err);
        console.log("Kereses:"+olduser);

        if (olduser.length>=1) {
            console.log('User: ' + olduser[0].email + ' found and logged in!');
            done(null, olduser);
        } else {

            var newuser = new Account({
                provider: "facebook",
                provider_id: profile.id,
                role: 'basic',
                username: profile.displayName,
                alias: profile.displayName,
                email: profile.emails[0].value
            });

            newuser.save(function(err) {
                if (err) {
                    console.log("Hiba van:" + err);
                }
                console.log('New user: ' + newuser.username + ' created and logged in!');
                done(null, newuser);
            });
        }
    });

}
));


app.get('/sikerBE/fblogin',
        function(req, res,next) {
            console.log("fb login call1");
            res.header("Access-Control-Allow-Origin", "*");
            next();
        },
        passport.authenticate('facebook', {scope: ['email','user_friends', 'user_photos', 'publish_actions']}));

app.get('/sikerBE/fbauth/callback',
        passport.authenticate('facebook'),
        function(req, res) {
            console.log("after fb callback");
            res.header("Access-Control-Allow-Origin", "*");

            console.log("FB login sikeres:"+req.isAuthenticated());
            res.redirect("/sikernaplo/basic.html");

        });


app.post('/sikerBE/mentes', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, myHeaderKey, Accept");
    console.log("mentes post");

    if (req.isAuthenticated()) {

        res.send("ok");
    } else {
        res.send("sikeretelen jogosultsag hiba miatt");
    }

});

app.options('/sikerBE/mentes', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("mentes opt");

    res.send("ok?");
});

app.get('/sikerBE/ping', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("pingged by " + req.session.passport.user.username);
//    console.log("belepve:" + req.isAuthenticated());
//    if (req.isUnAuthenticated()) {
//        console.log("jo");
//    } else {
//        console.log("nem jo");
//    }

    res.send(req.isAuthenticated());

});

app.get('/sikerBE/logout', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var utemp = req.session.passport.user.username;
    if (utemp === undefined) {
        utemp = 'session nelkuli hivas';
    }

    console.log("logout called by " + utemp);

    req.logout();
    res.send("ok");
});


app.get('/sikerBE/testemail', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("testemail");

    var mailOptions = {
        from: "?",
        to: "?",
        subject: "?",
        forceEmbeddedImages: true,
        html: "test letter <b>vastag</b> szöveg"
    };

    transport.sendMail(mailOptions);
    console.log("Email elküldve.");
    res.send("ok");

});

app.get('/sikerBE/aktUser', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var tempu = req.session.passport.user;
    var uname = "undefined";
    if (tempu !== undefined) {
        uname = tempu.username;
    }

    req.session.foo = Date.now();
    req.session.touch(function(err) {
        // session saved
        console.log("session touched:" + err);
    });

    console.log("aktUser:" + uname + " isAuth:" + req.isAuthenticated());
    console.log("lejar:" + req.session.cookie.maxAge / 1000 + "s mulva");


    if (req.session.passport.user === undefined) {
        res.send(false);
    } else {

        res.send(req.session.passport.user);
    }
});

app.post('/sikerBE/login', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("login post");

    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            console.log("nincs ilyen user");
            return res.send("nemok");
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.send("egyebhiba");
            }
            console.log("belépés ok");
            res.send(req.session.passport.user);
//            return req.session.passport.user;
        });
    })(req, res, next);
});

app.options('/sikerBE/login', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("login opt");
});

app.post('/sikerBE/register', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("reg post");

    Account.register(
            new Account({
        username: req.query.useremail,
        alias: req.query.username,
        role: 'basic',
        email: req.query.useremail}
    ), req.query.password, function(err, account) {
        if (err) {
            console.log("hiba:" + account);
        } else {
            console.log("ok:" + account.username);
        }
        res.send(account.username);
    });

});

app.options('/eroforrasBE/register', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("reg opt");
});

app.listen(Env.nodejs_port);
console.log('Proudlog listening on port: ' + Env.nodejs_port);






