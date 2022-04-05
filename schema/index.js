
const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull} = require("graphql");
const axios = require("axios");
const ROOT = `http://localhost:3000`

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLID },
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        users: { 
            type: new GraphQLList(UserType),
             async resolve(parent, args){
                 const {id} = parent;
                 const {data} = await axios.get(`${ROOT}/companies/${id}/users`)
                 return data;           
        }
    }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        company: {type: CompanyType, async resolve(parent, args) {
            const {companyId} = parent;
            const {data} = await axios.get(`${ROOT}/companies/${companyId}`)
            return data;
        }}
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        users: {
            type: GraphQLList(UserType),
            async resolve(){
                const {data} = await axios.get(`${ROOT}/users`);
                return data;
            }
        },
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            async resolve(parent, args) {
                const {id} = args;
                const {data} = await axios.get(`${ROOT}/users/${id}`);
                return data;
            }
        },
        companies: {
            type: GraphQLList(CompanyType),
            async resolve(){
                const {data} = await axios.get(`${ROOT}/companies`);
                return data
            }
        },
        company: {
            type: CompanyType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            async resolve(parent, args) {
                const {id} = args;
                const {data} = await axios.get(`${ROOT}/companies/${id}`)
                return data;
            }
        }
    })
})

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                companyId: {type: GraphQLID}
            },
            async resolve(parent, args){
                const {data} = await axios.post(`${ROOT}/users`, {...args})
                return data;
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent, {id}){
                const data = await axios.delete(`${ROOT}/users/${id}`);
                return data;
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                firstName: {type: GraphQLString},
                companyId: {type: GraphQLID}
            },
            async resolve(parent, args){
                const {data} = await axios.patch(`${ROOT}/users/${args.id}`, {...args});
                return data;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})