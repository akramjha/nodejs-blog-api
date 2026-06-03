const express = require("express");

const router = express.Router();

const { 
    loginUser,
    createUser,
    deleteUser,
    updateUser,
    createPost,
    getUser, 
    getPost,
    getMyPosts,
    updatePost,
    deletePost} = require("../userControllers");
    
const {
    authMiddleware,
    adminMiddleware } = require("../../middleware/authMiddleware");

router.post("/login", loginUser);
router.post("/", createUser);

router.post("/posts", authMiddleware, createPost);
router.get("/posts", authMiddleware, getPost);
router.put("/posts/:id", authMiddleware, updatePost);
router.delete("/posts/:id", authMiddleware, deletePost);

router.get("/my-posts", authMiddleware, getMyPosts);
router.get("/:id", authMiddleware, getUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);



module.exports = router;