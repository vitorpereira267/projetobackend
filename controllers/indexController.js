var jwt = require("jsonwebtoken");
const Person = require('../sequelize').Person

function generateAcessToken(email, password) {
    return jwt.sign = { email, password }, process.env.TOKEN_SECRET, { expiresIn: '1800s' }
}

exports.signup = function (req, res) {
    var { email } = req.body
    var { password } = req.body
    Person.findOne({
        where: { email: email }
    }).then(result => {
        if (result == null) {
            Person.create({ "email": email, "password": password })
                .then(user => {
                    var token = generateAcessToken(email, password)
                    req.session.user = user
                    req.session.token = token
                    res.redirect('/profile')
                })
        }
        else {
            res.redirect('/signup')
        }
    }).catch(err => {
        return done(err)
    })
}

exports.login = function (req, res) {
    var { email } = req.body
    var { password } = req.body
    Person.findOne({
        where: { email: email }
    }).then(user => {
        if (user == null) {
            req.flash('loginMessage', 'No user found with that email')
            res.redirect('/login')
        }
        else if (user.password != password) {
            req.flash('loginMessage', 'Wrong Password')
            res.redirect('/login')
        }
        else {
            const token = generateAcessToken(email, password)
            req.session.user = user
            req.session.token = token
            res.cookie('acess_token ', token, {
                expires: new Date(Date.now() + 8 * 3600000)
            }).redirect('/profile')
        }
    }).catch(err => {
        req.flash('loginMessage', err)
        res.redirect('/login')
    })
}