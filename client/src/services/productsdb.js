import { gql } from 'apollo-boost';

export const queryProducts = gql`
  {
    products {
      id
      title
      description
    }
  }
`;
