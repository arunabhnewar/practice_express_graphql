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
const users = require('../data');



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
        }
    })
})






// Module Exports
module.exports = RootQueryType;