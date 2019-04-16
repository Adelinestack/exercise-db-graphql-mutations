import { gql } from 'apollo-boost';

export const queryUsers = gql`
  {
    users {
      id
      name
      adress {
        id
        number
        street
        town
        postalcode
      }
    }
  }
`;

export const createQuery = gql`
  mutation(
    $name: String
    $password: String
    $number: Int
    $street: String
    $town: String
    $postalcode: Int
  ) {
    createUserAddress(
      name: $name
      password: $password
      number: $number
      street: $street
      town: $town
      postalcode: $postalcode
    ) {
      id
      name
    }
  }
`;
