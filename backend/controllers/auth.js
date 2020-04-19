const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
    const { name, email, password } = req.body;
    // res.json({
    //     user: { name, email, password }
    // });
    User.findOne({ email: req.body.email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            })
        }

        const { name, email, password } = req.body;
        let userName = shortId.generate();
        let profile = `${process.env.CLIENT_URL}/profile/${userName}`;
    
        let newUser = new User({ name, email, password, profile, userName });
    
        newUser.save((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            // res.json({
            //     user: success
            // });
            res.json({
                message: 'Sign up success. Please sign in'
            })
        })
    })
}

exports.signin = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            res.status(400).json({
                error: 'This email does not exist. Please sign in'
            })
        } 
        
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password does not match'
            })
        }

        // generate a token and send it to client
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        
        res.cookie('token', token, { 'expiresIn': '1d' });

        const { _id, userName, name, email, role } = user;
        return res.json({
            token,
            user: { _id, userName, name, email, role }
        })
    })
};

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "Signout success"
    });
}

exports.authorise = expressJwt({
    secret: process.env.JWT_SECRET
})