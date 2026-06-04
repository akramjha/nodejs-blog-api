const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req,res, next) => {
    try{
    const username = req.body.username;
    const password = req.body.password;
    const foundUser = await User.findOne({ username: username });
    if (!foundUser) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid credentials",
        });
    }
    const token = jwt.sign(
        {
            id: foundUser._id,
            username: foundUser.username,
            role: foundUser.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );
    res.json({
        message: "Login successful",
        token: token
    });
    } catch(error){
            next(error);
        }
};

const updateUser = async (req, res, next) => {

    try {

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                username: req.body.username,
                role: req.body.role
            },
            {
                new: true
            }
        );

        if (updatedUser) {

            res.json({
                message: "User updated successfully",
                user: updatedUser
            });

        } else {

            res.status(404).json({
                message: "User not found"
            });

        }

    } catch(error){
            next(error);
        }
};

const deleteUser = async (req, res, next) =>{
    try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (deletedUser){
        res.json({
            message: "User deleted successfully",
            deletedUser: deletedUser
        })
    } else {
        res.status(404).json({
            message: "User not found"
        });
    }
    } catch(error){
            next(error);
        }
};

const createUser = async (req, res, next) => {
    try {

        const {
            username,
            password,
            role
        } = req.body;

        // validation
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required!"
            });
        }

        // duplicate username check
        const existingUser = await User.findOne({
            username: username
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Username existed"
            });
        }

        // role validation
        if (role !== "admin" && role !== "staff") {
            return res.status(400).json({
                message: "Roles does not exists!"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const newUser = await User.create({
            username,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            message: "User created successfully!",
            user: newUser
        });

    } catch (error) {
        next(error);
    }
};

const getUser = async  (req, res, next) => {

    try {
        const foundUser = await User.findById(req.params.id);

        if (!foundUser){
            return res.status(404).json({
                message: "User not found!"
            });
        }

        res.json(foundUser);

        } catch(error){
            next(error);
        }
};

const createPost = async (req, res, next) => {
    try{
        const newPost = await Post.create({
            title: req.body.title,
            content: req.body.content,

            user: req.user.id
        });

        res.status(201).json(newPost);

    } catch(error){
        next(error);
    }
};

const getPost = async (req, res, next) => {
    try{
        const search = req.query.search || "";

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const query = {
            title: {
                $regex: search,
                $options: "i"
            }
        };

        const posts = await Post.find(query)
        .skip(skip)
        .limit(limit)
        .populate("user", "username role");

        const totalPosts = await Post.countDocuments(query);

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            posts
        });
    } catch (error){
        next(error);
    }
}

const getMyPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({
            user: req.user.id
        }).populate("user", "username role");

        res.json(posts);
    } catch(error){
        next(error)
    }
    
}

const updatePost = async (req, res, next) => {
    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // ownership check
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;

        await post.save();

        res.json({
            message: "Post updated successfully",
            post
        });

    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        console.log("Post owner:", post.user.toString());
        console.log("Token user:", req.user.id);

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Access denied!"
            });
        }

        await post.deleteOne();

        res.json({
            message: "Post deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginUser,
    getUser,
    deleteUser,
    updateUser,
    createUser,
    createPost,
    getPost,
    getMyPosts,
    updatePost,
    deletePost
};