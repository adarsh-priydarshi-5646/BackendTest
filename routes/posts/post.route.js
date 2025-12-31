const express = require('express')
const router = express.Router()
const { createPost, deletePostById, updatePostById, findPostById, findAllPosts } = require('../../controllers/posts/post.controller.js')
const protect = require('../../middlewares/auth.middleware.js')


router.get('/', findAllPosts)
router.get('/:id', findPostById)

router.post('/', protect, createPost)
router.patch('/:id', protect, updatePostById)
router.delete('/:id', protect, deletePostById)


module.exports = router;