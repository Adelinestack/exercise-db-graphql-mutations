import { gql } from 'apollo-boost';

export const queryOrders = gql`
  {
    orders {
      id
      date
      totalht
      userid
      user {
        id
        name
      }
      products {
        id
        title
        price
      }
    }
  }
`;

export const createQuery = gql`
  mutation($user: ID, $products: [Int]) {
    createOrder(userId: $user, products: $products) {
      id
      date
      totalht
      userid
      user {
        id
        name
      }
      products {
        id
        title
        price
      }
    }
  }
`;
