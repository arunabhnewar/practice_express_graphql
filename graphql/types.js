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
    GraphQLScalarType,
    GraphQLInputObjectType,
    Kind } = require("graphql");
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



// Date Valdation
function dateValidation(value) {
    const date = new Date(value);
    if (date.toString() === "Invalid Date") {
        throw new GraphQLError(`${value} is not a valid date`)
    } else {
        return date.toISOString()
    }
}




// Date Type
const DateType = new GraphQLScalarType({
    name: "DateType",
    description: "It shows a date",
    parseValue: dateValidation,
    parseLiteral: (AST) => {
        if (AST.kind === Kind.STRING || AST.kind === Kind.INT) {
            return dateValidation(AST.value);
        } else {
            throw GraphQLError(`${AST.value} is not a string or number`)
        }
    },
    serialize: dateValidation,
})



// email validation
function emailValidate(email) {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email.match(regex)) {
        return email;
    } else {
        throw new GraphQLError(`${value} is not a valid email`)
    }
}



// Email Type
const EmailType = new GraphQLScalarType({
    name: "EmailType",
    description: "Its for email",
    parseValue: emailValidate,
    parseLiteral: (AST) => {
        if (AST.kind === Kind.STRING) {
            return emailValidate(AST.value);
        } else {
            throw GraphQLError(`${AST.value} is not a string`)
        }
    },
    serialize: emailValidate,
})



// Users Type 
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
            type: new GraphQLNonNull(EmailType)
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
        },
        createdAt: {
            type: DateType
        }

    })
})



// Post Type 
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




// User Type Input
const UserTypeInput = new GraphQLInputObjectType({
    name: "UserTypeInput",
    description: "Provide input to add a new user",
    fields: () => ({
        firstName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        lastName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        gender: {
            type: new GraphQLNonNull(GenderEnumType)
        },
        phone: {
            type: new GraphQLNonNull(GraphQLString)
        },
        email: {
            type: new GraphQLNonNull(EmailType)
        },
        createdAt: {
            type: DateType
        }
    })
})



// Update User Type Input 
const UpdateUserTypeInput = new GraphQLInputObjectType({
    name: "UpdateUserTypeInput",
    description: "Provide input to update an exist user",
    fields: () => ({
        firstName: {
            type: GraphQLString,
        },
        lastName: {
            type: GraphQLString,
        },
        gender: {
            type: GenderEnumType,
        },
        phone: {
            type: GraphQLString,
        },
        email: {
            type: GraphQLString,
        },
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



// Root Mutation
const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        addUser: {
            type: UserType,
            args: {
                input: {
                    type: UserTypeInput,
                },
            },
            resolve: (_, {
                input: {
                    firstName,
                    lastName,
                    gender,
                    phone,
                    email,
                    createdAt,
                } }) => {
                const user = {
                    id: users.length + 1,
                    firstName,
                    lastName,
                    gender,
                    phone,
                    email,
                    posts: [],
                    createdAt,
                };

                users.push(user);
                return user;
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLID
                },
                input: {
                    type: UpdateUserTypeInput
                },
            },
            resolve: (_, {
                id,
                input: {
                    firstName,
                    lastName,
                    gender,
                    phone,
                    email } }) => {

                let updatedUser = null;
                users.forEach((user) => {

                    if (user.id == id) {
                        if (firstName) {
                            user.firstName = firstName
                        }
                        if (lastName) {
                            user.lastName = lastName
                        }
                        if (gender) {
                            user.gender = gender
                        }
                        if (phone) {
                            user.phone = phone
                        }
                        if (email) {
                            user.email = email
                        }

                        updatedUser = user;
                    }
                });
                return updatedUser;
            },
        },

        deleteUser: {
            type: GraphQLNonNull(GraphQLBoolean),
            args: {
                id: {
                    type: GraphQLID
                },
            },
            resolve: (_, { id }) => {
                const index = users.findIndex((user) => user.id == id);

                if (index >= 0) {
                    users.splice(index, 1);
                    return true;
                } else {
                    return false;
                }
            }
        }
    })
})





// Module Exports
module.exports = {
    RootQueryType,
    RootMutationType
};