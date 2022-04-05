const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const schema = require("./schema")
const app = express();

app.use("/graphql", graphqlHTTP({
    graphiql: true,
    schema
}));

const port = 4000;

app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})

