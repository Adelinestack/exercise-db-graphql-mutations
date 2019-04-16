import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { queryOrders, createQuery } from '../services/ordersdb';
import { queryProducts } from '../services/productsdb';
import { queryUsers } from '../services/usersdb';

class OrderCreation extends Component {
  state = {
    user: '',
    products: [],
  };

  onChange(
    field,
    {
      target: { value },
    }
  ) {
    this.setState({ [field]: value });
  }

  onChecked(
    productChecked,
    {
      target: { checked },
    }
  ) {
    if (checked) {
      this.setState(({ products }) => ({
        products: [...products, Number(productChecked)],
      }));
    } else {
      this.setState(({ products }) => {
        const newTabProduct = products
          .map(product => (product !== Number(productChecked) ? product : null))
          .filter(prod => !!prod);
        return { products: newTabProduct };
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.createOrder({
      variables: this.state,
      refetchQueries: [{ query: queryOrders }],
    });
  }

  render() {
    const { loading, orders } = this.props.getOrders;

    const ordersList =
      !loading && orders.map(order => <div key={order.id}>{order.id}</div>);

    const { loading: userLoading, users } = this.props.getUsers;
    const usersList =
      !userLoading &&
      users.map(({ id, name }) => (
        <option value={id} key={id}>
          {name}
        </option>
      ));

    const { loading: productLoading, products } = this.props.getProducts;
    const productsList =
      !productLoading &&
      products.map(({ id, title }) => (
        <div>
          <label>
            {title}
            <input
              type="checkbox"
              name={title}
              onChange={this.onChecked.bind(this, id)}
            />
          </label>
        </div>
      ));

    return (
      <div>
        <h2>Create Order</h2>
        <div>{ordersList}</div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <div>
            <label>User</label>
            <div>
              <select
                name="user"
                value={this.state.userSelected}
                onChange={this.onChange.bind(this, 'user')}
              >
                {usersList}
              </select>
            </div>
          </div>
          <div>
            <label>Products</label>
            {productsList}
          </div>
          <input type="submit" value="Create" />
        </form>
      </div>
    );
  }
}

export default compose(
  graphql(queryUsers, { name: 'getUsers' }),
  graphql(queryProducts, { name: 'getProducts' }),
  graphql(queryOrders, { name: 'getOrders' }),
  graphql(createQuery, { name: 'createOrder' })
)(OrderCreation);
