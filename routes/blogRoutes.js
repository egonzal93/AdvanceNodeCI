const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const cleanCache = require('../middlewares/cleanCache');

const Blog = mongoose.model('Blog');

module.exports = app => {

  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {

    // const redis = require('redis');
    // const redisUrl = 'redis://127.0.0.1:6379';
    // const redisClient = redis.createClient(redisUrl);
    // const util = require('util');
    //
    // redisClient.get = util.promisify(redisClient.get);
    //
    // // console.log('id', req.user.id);
    //
    // const cachedBlogs = await redisClient.get(req.user.id);
    //
    // // console.log('cachedBlogs', cachedBlogs);
    //
    // if (cachedBlogs) {
    //   console.log('SERVING FROM REDIS');
    //   return res.send(JSON.parse(cachedBlogs));
    // }

    const blogs = await Blog
        .find({ _user: req.user.id })
        .cache({
            key: req.user.id
        });

    // console.log('SERVING FROM MONGODB');
    //
    res.send(blogs);
    //
    // redisClient.set(req.user.id, JSON.stringify(blogs));

  });

  // Automatic clearing of cache, after the handler is executed.
  app.post('/api/blogs', requireLogin, cleanCache, async (req, res) => {

    const { title, content , imageUrl } = req.body;

    const blog = new Blog({
      imageUrl,
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);



    } catch (err) {
      res.send(400, err);
    }

  });
};
