import React from 'react';
import { graphql } from 'react-apollo';
import { queryProducts } from '../services/productsdb.js';

const Products = props => {
  const { loading, products = [] } = props.data;
  const productsInfos = products.map(({ title, description }) => (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ));
  return (
    <div>
      <h2>Products</h2>
      {loading || productsInfos}
    </div>
  );
};

export default graphql(queryProducts)(Products);
