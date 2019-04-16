import React from 'react';
import { graphql } from 'react-apollo';
import { queryUsers } from '../services/usersdb';

const Users = props => {
  const { loading, users = [] } = props.data;
  const usersInfos = users.map(
    ({ name, adress: { number, street, town, postalcode } }) => (
      <div>
        <h3>{name}</h3>
        <p>
          {number} {street} {postalcode} {town}
        </p>
      </div>
    )
  );
  return (
    <div>
      <h2>Users</h2>
      {loading || usersInfos}
    </div>
  );
};

export default graphql(queryUsers)(Users);
