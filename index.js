const { GraphQLServer } = require('graphql-yoga');
const fetch = require('node-fetch');

const typeDefs = `
    type Query {
        hello(name: String): String!
        getPerson(id: Int!): Person
    }

    type Species {
        name: String
        classification: String
        designation: String
        average_height: String
        skin_colors: String
    }

    type Planet {
        name: String
        rotation_period: String
        orbital_period: String
    }

    type Film {
        title: String
        episode_id: Int
        opening_crawl: String
        director: String 
        producer: String
        release_date: String
    }
    
    type Person {
        name: String
        height: String
        mass: String
        hair_color: String
        skin_color: String
        eye_color: String
        birth_year: String
        gender: String
        films: [Film]
        homeworld: Planet
        species: Species
    }
`;

const resolvers = {
    Person: {
        species: async parent => {
            const response = await fetch(parent.species);
            return response.json();
        },
        homeworld: async parent => {
            const response = await fetch(parent.homeworld);
            return response.json();
        },
        films: parent => {
            const promises = parent.films.map(async url => {
                const response = await fetch(url);
                return response.json();
            });

            return Promise.all(promises);
        }
    },
    Query: {
        hello: (_, { name }) => `Hello ${name} || "World"`,
        getPerson: async (_, { id }) => {
            const response = await fetch(`https://swapi.co/api/people/${id}/`);
            return response.json();
        }
    }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('server is running on localhost:4000'));
