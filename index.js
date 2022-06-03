const express = require('express');
require('./helpers/dbConnection');
const bodyParser = require('body-parser');

const { errorHandler } = require('./middlewares');
const blogsRouter = require('./routes/blogsRouter')
const userRouter = require('./routes/userRouter')


const server = express();

server.use(bodyParser.json());
server.use('/users', userRouter);
server.use('/blogs', blogsRouter);
server.use(errorHandler);

server.listen(3000, 'localhost', () => {
    console.log(`server is listening on: 3000`);
});
