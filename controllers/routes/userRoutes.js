const express = require("express");

const router = express.Router();

const {body} = require("express-validator");

const validateRequest = require("../../middleware/validationMiddleware");

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

router.post("/login", 
    [
        body("username")
            .notEmpty()
            .withMessage("Username is required"),

        body("password")
            .notEmpty()
            .withMessage("Password is required")
    ],
    validateRequest,
    loginUser
);

router.post("/",
    [
        body("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({min: 6})
        .withMessage("Username must be atleast 3 characters"),

        body("")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({min: 6})
        .withMessage("Username must be atleast 6 characters"),

        body("")
        .optional()
        .isIn(["admin", "staff"])
        .withMessage("Role must be admin or staff")
    ],
    validateRequest,
    createUser
);

router.post("/posts", authMiddleware, createPost);
router.get("/posts", authMiddleware, getPost);
router.put("/posts/:id", authMiddleware, updatePost);
router.delete("/posts/:id", authMiddleware, deletePost);

router.get("/my-posts", authMiddleware, getMyPosts);
router.get("/:id", authMiddleware, getUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);



module.exports = router;