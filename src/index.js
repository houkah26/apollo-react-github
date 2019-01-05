import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import apolloClient from "./apolloClient";

import "./styles.css";

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
