const prisma = require('../../config/db.config.js')

const createPost = async (req, res) => {
    const { title, description } = req.body

    if (!title || !description) {
        return res.status(400).json({
            message: "Title and description are required"
        })
    }

    try {
        const newPost = await prisma.post.create({
            data: {
                title,
                description,
                userId: req.userId
            }
        })

        return res.status(201).json({
            message: "Post created successfully",
            post: newPost
        })
    } catch (err) {
        console.error("createPost error:", err)
        return res.status(500).json({ message: "Internal server error" })
    }
}


const findPostById = async (req, res) => {
    const postId = Number(req.params.id)

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        return res.json(post)
    } catch (err) {
        console.error("findPostById error:", err)
        return res.status(500).json({ message: "Internal server error" })
    }
}


const findAllPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                user: {
                    select: { id: true, name: true }
                }
            }
        })

        return res.json(posts)
    } catch (err) {
        console.error("findAllPosts error:", err)
        return res.status(500).json({ message: "Internal server error" })
    }
}


const updatePostById = async (req, res) => {
    const { id } = req.params
    const postId = Number(id)
    const { title, description } = req.body

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId }
        })

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }


        if (req.role !== 'ADMIN' && post.userId !== req.userId) {
            return res.status(403).json({ message: "Access denied" })
        }


        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: { title, description }
        })

        return res.json({
            message: "Post updated successfully",
            post: updatedPost
        })
    } catch (err) {
        console.error("updatePost error:", err)
        return res.status(500).json({ message: "Internal server error" })
    }
}


const deletePostById = async (req, res) => {
    const postId = Number(req.params.id)

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId }
        })

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        if (req.role !== 'ADMIN' && post.userId !== req.userId) {
            return res.status(403).json({ message: "Access denied" })
        }

        await prisma.post.delete({
            where: { id: postId }
        })

        return res.json({ message: "Post deleted successfully" })
    } catch (err) {
        console.error("deletePost error:", err)
        return res.status(500).json({ message: "Internal server error" })
    }
}



module.exports = {
    createPost,
    findPostById,
    findAllPosts,
    updatePostById,
    deletePostById
}