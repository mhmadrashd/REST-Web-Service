const { ApolloServer, gql } = require('apollo-server');


let users = [
    {
        id: 1, fName: 'Mohamed', lName: 'Rashed',
        email: 'email', isSuspended: true, dob: '11-2-2000'
    },
    {
        id: 2, fName: 'Khaled', lName: 'Mohamed',
        email: 'email', isSuspended: true, dob: '11-2-1999'
    },
    {
        id: 3, fName: 'Mina', lName: 'Mohamed',
        email: 'email', isSuspended: true, dob: '11-2-1998'
    }

];
let comments = [
    {
        id: 1,
        content: "Comment 1",
        user: users[1],
        date: '12-2-2010'
    },


];
let Blogs = [
    {
        id: 1, title: 'Blog1',
        body: 'cfegshty', date: '11-2-2010',
        author: users[0], comments: [comments[0]]
    },
    {
        id: 2, title: 'Blog2',
        body: 'byrenbdhry', date: '11-2-2010',
        author: users[0], comments: [comments[0]]
    },
    {
        id: 3, title: 'Blog3',
        body: 'ryhdtgs', date: '11-2-2010',
        author: users[0], comments: [comments[0]]
    }

];

const Schema = `
    type User {
        id: ID!
        fName: String
        lName: String
        email: String
        isSuspended: Boolean
        dob: String
    }

    type Comment {
        id: ID
        user: User
        content: String
        date: String
    }

    type Blog {
        id: ID!
        title: String
        body: String
        comments: [Comment]
        author: User!
    }

    type Query {
        allUsers: [User]
        allBlogs: [Blog]
        allComments: [Comment]
    }

    type Mutation {
        deleteBlog (id: Int): [Blog]
        createBlog(id: Int, title: String, 
        body:String,
        author:Int): [Blog]
    }

`
const typeDefs = gql(Schema);
const resolvers = {
    Query: {
        allUsers: () => users,
        allBlogs: () => Blogs,
        allComments: () => comments
    },
    Mutation: {
        deleteBlog: (_, { id }) => {
            Blogs = Blogs.filter((Blog) => Blog.id !== id);
            return Blogs;
        },
        createBlog: (_, { id, title,
            body,
            author }) => {
            Blogs.push({
                id,
                title,
                body,
                author: users.filter((user) => user.id === author)[0],
            });
            return Blogs;
        }
    }
};
const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4000)
    .then(({ url }) => {
        console.log(`Server ready at ${url}`);
    });