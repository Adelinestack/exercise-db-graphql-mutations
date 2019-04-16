import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { createQuery, queryUsers } from '../services/usersdb';

class UserCreation extends Component {
  state = {
    name: '',
    password: '',
    number: null,
    street: '',
    postalcode: null,
    town: '',
  };

  onChange(
    field,
    {
      target: { value },
    }
  ) {
    this.setState({
      [field]: ['postalcode', 'number'].includes(field) ? Number(value) : value,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.createUser({
      variables: this.state,
      refetchQueries: [{ query: queryUsers }],
    });
  }

  render() {
    const usersList =
      !this.props.getUsers.loading &&
      this.props.getUsers.users.map(user => (
        <div key={user.id}>{user.name}</div>
      ));

    return (
      <div>
        <h2>Create User</h2>
        <div>{usersList}</div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              onChange={this.onChange.bind(this, 'name')}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="text"
              name="password"
              onChange={this.onChange.bind(this, 'password')}
            />
          </div>
          <div>
            <p>Address</p>
            <div>
              <label>Number</label>
              <input
                type="number"
                name="number"
                onChange={this.onChange.bind(this, 'number')}
              />
            </div>
            <label>Street</label>
            <div>
              <input
                type="text"
                name="street"
                onChange={this.onChange.bind(this, 'street')}
              />
            </div>
            <label>Postal Code</label>
            <div>
              <input
                type="number"
                name="postalcode"
                onChange={this.onChange.bind(this, 'postalcode')}
              />
            </div>
            <label>Town</label>
            <div>
              <input
                type="text"
                name="town"
                onChange={this.onChange.bind(this, 'town')}
              />
            </div>
          </div>
          <input type="submit" value="Create" />
        </form>
      </div>
    );
  }
}

export default compose(
  graphql(queryUsers, { name: 'getUsers' }),
  graphql(createQuery, { name: 'createUser' })
)(UserCreation);
