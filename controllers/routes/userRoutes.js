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
    deletePost,
    createComment,
    getComments} = require("../userControllers");
    
const {
    authMiddleware,
    adminMiddleware } = require("../../middleware/authMiddleware");

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
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

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: akram
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - staff
 *                 example: staff
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation failed or username already exists
 */
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

/**
 * @swagger
 * /api/users/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search post title
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of posts per page
 *
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - newest
 *             - oldest
 *         description: Sort posts
 *
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get("/posts", authMiddleware, getPost);
router.put("/posts/:id", authMiddleware, updatePost);
router.delete("/posts/:id", authMiddleware, deletePost);

router.get("/my-posts", authMiddleware, getMyPosts);
router.get("/:id", authMiddleware, getUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

/**
 * @swagger
 * /api/users/posts/{id}/comments:
 *   post:
 *     summary: Create a comment for a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: Nice tutorial bro!
 *     responses:
 *       201:
 *         description: Comment created successfully
 */
router.post("/posts/:id/comments", authMiddleware, createComment);

/**
 * @swagger
 * /api/users/posts/{id}/comments:
 *   get:
 *     summary: Get comments for a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: List of comments for the post
 */
router.get("/posts/:id/comments", getComments);

module.exports = router;