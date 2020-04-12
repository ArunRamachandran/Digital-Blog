const User = require('../models/user');
const shortId = require('shortid');

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