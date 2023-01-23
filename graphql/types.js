// Dependencies
const { GraphQLEnumType,
    GraphQLBoolean,
    GraphQLError,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLScalarType } = require("graphql");
const { users, posts } = require('../data');



// Gender Type 
const GenderEnumType = new GraphQLEnumType({
    name: "GenderEnumType",
    description: "Gender defined",
    values: {
        male: {
            value: "male"
        },
        female: {
            value: "female"
        }
    }
})



// Users Type Declare
const UserType = new GraphQLObjectType({
    name: "User",
    description: "Single User data",
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        firstName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        lastName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        gender: {
            type: GenderEnumType
        },
        phone: {
            type: new GraphQLNonNull(GraphQLString)
        },
        email: {
            type: new GraphQLNonNull(GraphQLString)
        },
        posts: {
            type: new GraphQLList(new GraphQLNonNull(PostType)),
            resolve: (user) => {
                return posts.filter((post) => {
                    if (user.posts.includes(post.id)) {
                        return true
                    }
                    {
                        return false
                    }
                })
            }
        }

    })
})



// Post Type Declare
const PostType = new GraphQLObjectType({
    name: "Post",
    description: "User Post",
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        title: {
            type: new GraphQLNonNull(GraphQLString)
        },
        description: {
            type: new GraphQLNonNull(GraphQLString)
        },
        user: {
            type: UserType,
            resolve: (post, args) => {
                return users.find((user) => user.id == post.user);
            }
        }
    })
})



// Root query
const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        users: {
            type: new GraphQLList(new GraphQLNonNull(UserType)),
            resolve: () => {
                return users;
            }
        },
        user: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLID,
                },
            },
            resolve: (_, { id }) => {
                const user = users.find((user) => user.id == id);
                return user;
            }
        },
        posts: {
            type: new GraphQLList(new GraphQLNonNull(PostType)),
            resolve: () => {
                return posts;
            },
        },
        post: {
            type: PostType,
            args: {
                id: {
                    type: GraphQLID
                },
            },
            resolve: (_, { id }) => {
                return posts.find((post) => post.id == id);
            }
        }
    })
})






// Module Exports
module.exports = RootQueryType;