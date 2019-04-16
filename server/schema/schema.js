const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLList,
} = require('graphql');

const {
  selectAllTable,
  selectById,
  selectByUserId,
  selectProductsByOrderId,
  addUser,
  createUserAddress,
  createOrder,
} = require('../dbCalls');

const userType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    password: { type: GraphQLString },
    adress: {
      type: adressType,
      resolve: async ({ id }) => {
        return await selectById('adresses', id);
      },
    },
    orders: {
      type: new GraphQLList(orderType),
      resolve: async ({ id }) => await selectByUserId('orders', id),
    },
  }),
});

const adressType = new GraphQLObjectType({
  name: 'adress',
  fields: () => ({
    id: { type: GraphQLID },
    number: { type: GraphQLInt },
    street: { type: GraphQLString },
    town: { type: GraphQLString },
    postalcode: { type: GraphQLInt },
  }),
});

const productType = new GraphQLObjectType({
  name: 'product',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    image: { type: GraphQLString },
  }),
});

const orderType = new GraphQLObjectType({
  name: 'order',
  fields: () => ({
    id: { type: GraphQLID },
    date: { type: GraphQLString },
    totalht: { type: GraphQLFloat },
    userid: { type: GraphQLString },
    user: {
      type: userType,
      resolve: async ({ userid }) => {
        return await selectById('users', userid);
      },
    },
    products: {
      type: new GraphQLList(productType),
      resolve: async ({ id }) => await selectProductsByOrderId(id),
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    users: {
      type: new GraphQLList(userType),
      resolve: async (parent, args) => await selectAllTable('users'),
    },
    user: {
      type: userType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (parent, { id }) => await selectById('users', id),
    },
    adresses: {
      type: new GraphQLList(adressType),
      resolve: async (parent, args) => await selectAllTable('adresses'),
    },
    adress: {
      type: adressType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (parent, { id }) => await selectById('adresses', id),
    },
    products: {
      type: new GraphQLList(productType),
      resolve: async (parents, args) => await selectAllTable('products'),
    },
    product: {
      type: productType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (parent, { id }) => await selectById('products', id),
    },
    orders: {
      type: new GraphQLList(orderType),
      resolve: async (parents, args) => await selectAllTable('orders'),
    },
    order: {
      type: orderType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (parent, { id }) => await selectById('orders', id),
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: userType,
      args: {
        name: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (parent, { name, password }) =>
        await addUser(name, password),
    },
    createUserAddress: {
      type: userType,
      args: {
        name: { type: GraphQLString },
        password: { type: GraphQLString },
        number: { type: GraphQLInt },
        street: { type: GraphQLString },
        town: { type: GraphQLString },
        postalcode: { type: GraphQLInt },
      },
      resolve: async (
        parent,
        { name, password, number, street, town, postalcode }
      ) =>
        await createUserAddress(
          name,
          password,
          number,
          street,
          town,
          postalcode
        ),
    },
    createOrder: {
      type: orderType,
      args: {
        userId: { type: GraphQLID },
        products: { type: new GraphQLList(GraphQLInt) },
      },
      resolve: async (parent, { userId, products }) =>
        await createOrder(userId, products),
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
