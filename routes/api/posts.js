const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check,validationResult} = require('express-validator');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
require('dotenv').config();

// @route   POST api/posts
// @desc    Create a Post
// @access  private
router.post('/',[auth,[check('text','Text is required').not().isEmpty()
]],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost =new Post ({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        });
        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/posts
// @desc    get all Posts
// @access  private

router.get('/',auth,async(req,res)=>{
    try {
        const posts = await Post.find().sort({date:-1});
        res.json(posts)
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/posts/:id
// @desc    get Post by id
// @access  private

router.get('/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'Post not found'})
        }
        res.json(post)
    } catch (err) {
        if(err.kind ==='ObjectId'){
            return res.status(404).json({msg:'Post not found'})
        }
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/posts/:id
// @desc    delete Post by id
// @access  private

router.delete('/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'Post not found'})
        }
        // check user
        if(post.user.toString() !==req.user.id){
            return res.status(401).json({msg:'User not authorized'})
        }
        await post.remove();
        res.json({msg:'Post Removed'});
    } catch (err) {
        if(err.kind ==='ObjectId'){
            return res.status(404).json({msg:'Post not found'})
        }
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/posts/like/:id
// @desc    like a post
// @access  private
router.put('/like/:id',auth, async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
            return res.status(400).json({msg:"Post already liked"});
        }
        post.likes.unshift({user:req.user.id});
        await post.save();
        res.json(post.likes);
    } catch (err) {
        if(err.kind ==='ObjectId'){
            return res.status(404).json({msg:'Post not found'})
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route   PUT api/posts/unlike/:id
// @desc    unlike a post
// @access  private
router.put('/unlike/:id',auth, async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length==0){
            return res.status(400).json({msg:"Post hasn't been liked yet"});
        }
        // Get the remove index
        const removeIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex,1);
        await post.save();
        res.json(post.likes);
    } catch (err) {
        if(err.kind ==='ObjectId'){
            return res.status(404).json({msg:'Post not found'})
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


module.exports = router;