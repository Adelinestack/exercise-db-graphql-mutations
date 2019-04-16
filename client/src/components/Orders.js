import React from 'react';
import { graphql } from 'react-apollo';
import { queryOrders } from '../services/ordersdb.js';

const Orders = props => {
  const { loading, orders = [] } = props.data;
  const ordersInfos = orders.map(
    ({ id, date, totalht, userid, user: { name }, products }) => (
      <div>
        <h3>Order {id}</h3>
        <p>
          Client {userid} : {name}
        </p>
        <p>{date}</p>
        <p>{totalht} €</p>
      </div>
    )
  );
  return (
    <div>
      <h2>Orders</h2>
      {loading || ordersInfos}
    </div>
  );
};

export default graphql(queryOrders)(Orders);
