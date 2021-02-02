const { compareSync } = require('bcryptjs');
const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// @route   POST api/users
// @desc    Register User
// @access  public
router.post('/',
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid Email').isEmail(),
    check('password','Please enter a Password with 6 or more characters').isLength({min:6}),
    async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const{name,email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({errors:[{msg:'User already Exists'}]})
        }
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            default:'mm'
        })
        user = new User({
            name,
            email,
            avatar,
            password
        })
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();
        const payload = {
            user:{
                id:user._id
            }
        }
        jwt.sign(payload,process.env.jwtSecret,{expiresIn:360000},(err,token)=>{
            if(err) throw err;
            res.json({token})
        });
    } catch (err) {
        compareSync.log(err.message);
        res.status(500).send('Server Error');
    }
    

    
});


module.exports = router;