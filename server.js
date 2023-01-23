// Dependencies
const express = require("express");
const { graphqlHTTP } = require('express-graphql');
const schema = require("./graphql/schema");


// App Initialize
const app = express();




// Express Graphql middleware
app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        graphiql: true,
    }),
);




// App Listen
app.listen(3000, () => {
    console.log("fucking server is running");
})