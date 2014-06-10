

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
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://www.example.com/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {

    Account.find({'provider_id': profile.id, 'provider': 'facebook'}, function(err, olduser) {

        if (olduser._id) {
            console.log('User: ' + olduser.username +  ' found and logged in!');
            done(null, olduser);
        } else {
            var newuser = new Account({
            provider : "facebook", 
            provider_id: profile.id,
            role: '',
            username : profile.name.givenName + profile.name.familyName,
            email : "TBD..."
            });

            newuser.save(function(err) {
                if (err) {
                    throw err;
                }
                console.log('New user: ' + newuser.username + ' created and logged in!');
                done(null, newuser);
            });
        }
    });

//    Account.findOrCreate(profile.name, function(err, user) {
//        if (err) {
//            return done(err);
//        }
//        done(null, user);
//    });
}
));

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook',
        passport.authenticate('facebook', {scope: ['read_stream', 'publish_actions']})
        );

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {successRedirect: '/',
    failureRedirect: '/login'})
        );


app.post('/eroforrasBE/mentes', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, myHeaderKey, Accept");
    console.log("mentes post");

    if (req.isAuthenticated()) {

        res.send("ok");
    } else {
        res.send("sikeretelen jogosultsag hiba miatt");
    }

});

app.options('/eroforrasBE/mentes', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("mentes opt");

    res.send("ok?");
});

app.get('/eroforrasBE/ping', function(req, res) {
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

app.get('/eroforrasBE/logout', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("logout called by " + req.session.passport.user.username);

    req.logout();
    res.send("ok");
});


app.get('/eroforrasBE/testemail', function(req, res) {
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

app.get('/eroforrasBE/aktUser', function(req, res) {
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

app.post('/eroforrasBE/login', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("login post");

    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            console.log("nincs ilyen user");
            return res.send("nem ok");
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.send("egyeb hiba");
            }
            console.log("belépés ok");
            return res.send("ok");
        });
    })(req, res, next);
});

app.options('/eroforrasBE/login', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("login opt");
});



app.listen(Env.nodejs_port);
console.log('Listening on port: ' + Env.nodejs_port);






