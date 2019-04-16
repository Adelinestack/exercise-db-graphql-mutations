import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import Users from './components/Users';
import Products from './components/Products';
import Orders from './components/Orders';
import UserCreation from './components/UserCreation';
import OrderCreation from './components/OrderCreation';
import './App.css';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <ApolloProvider client={client}>
          <header className="App-header">
            <BrowserRouter>
              <h1>Ecommerce</h1>
              <Route exact path="/users" component={Users} />
              <Route exact path="/products" component={Products} />
              <Route exact path="/orders" component={Orders} />
              <Route exact path="/createUser" component={UserCreation} />
              <Route exact path="/createOrder" component={OrderCreation} />
            </BrowserRouter>
          </header>
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
