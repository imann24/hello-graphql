const { readFileSync } = require("fs")
const { join } = require("path");
const { parse } = require("csv-parse/sync");
const { ApolloServer } = require("apollo-server");


const typeDefs = readFileSync(join(__dirname, "../var/movie-schema.graphql")).toString("utf-8");
// provide custom type conversion to ensure types primitive are accurate from CSV
const data = parse(readFileSync(join(__dirname, "../var/imdb-movie-data.csv")), {columns: true, cast: true});
// convert appropriate strings to arrays
data.map(d => {
    d.actors = d.actors.split(",").map(item => item.trim());
    d.genres = d.genres.split(",").map(item => item.trim());
});

const resolvers = {
    Query: {
        allMovies: () => data,
        moviesByYear: (root, args, context) => data.filter(m => m.year === args.year),
        movie: (root, args, context) => data.find(m => m.title === args.title)
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
});
