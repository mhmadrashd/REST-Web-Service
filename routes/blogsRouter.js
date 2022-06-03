const express = require('express');
const blogsRouter = express.Router();

const { getBlogsHateos } = require('../helpers/constants');
const { Blog } = require('../models');


blogsRouter.post('/', async (req, res, next) => {
    const { title, body } = req.body;

    try {
        const { _id: blogId } = await Blog.create(
            { user: req.user._id, title, body }
        );

        req.user.blogs.push(blogId);
        await req.user.save();

    } catch (err) {
        return next(err);
    }
    res.status(204).end();
});

blogsRouter.get('/:id', async (req, res) => {
    const blogsHateos = getBlogsHateos('https://', 'localhost')

    res.status(200).send(blogsHateos);
});

blogsRouter.get('/', async (req, res) => {
    const blogsHateos = getBlogsHateos('https://', 'localhost')
    res.status(200).send(blogsHateos);
});

blogsRouter.get('/:blog_id', async (req, res) => {
    res.header({
        'Content-Type': 'application/json'
    });
    const populatedBlogs = await req.blog.populate('user');
    res.status(201)
        .send(populatedBlogs);
});

//Edit Blog by ID
blogsRouter.patch("/:blog_id", async (req, res, next) => {
    const { blog_id } = req.params;
    const { title, body } = req.body;
    try {
        await Blog.findByIdAndUpdate(blog_id, {
            $set: { title, body },
        });
        res.send({ success: true });
    } catch (error) {
        return next(error);
    }
});

//Delete Blog by ID
blogsRouter.delete("/:blog_id", async (req, res, next) => {
    const { blog_id } = req.params;
    try {
        await Blog.findByIdAndDelete(blog_id);
        res.send({ success: true });
    } catch (error) {
        next(error);
    }
});

blogsRouter.get('/:blog_id/comments', async (req, res, next) => {
    const { blog_id } = req.params;
    res.header({
        'Content-Type': 'application/json'
    });
    try {
        const comments = await Blog.findById(blog_id)
            .populate('comments').select('comments');
        res.send(comments);
    } catch (error) {
        return next(error);
    }
});

blogsRouter.get('/:blog_id/authors', async (req, res, next) => {
    const { blog_id } = req.params;
    res.header({
        'Content-Type': 'application/json'
    });
    try {
        const authors = await Blog.findById(blog_id)
            .populate('authors').select('authors');
        res.send(authors);
    } catch (error) {
        return next(error);
    }
});

blogsRouter.param('blog_id', async (req, res, next, blogID) => {
    console.log('blogID: ', blogID);
    try {
        const blog = await Blog.findById(blogID);
        if (!blog) throw new Error('notfound');
        req.blog = blog;
    } catch (err) {
        return next(err);
    }
    next();
});

module.exports = blogsRouter;