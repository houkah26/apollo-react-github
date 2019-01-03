import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Loading from "../common/Loading";

const GET_CURRENT_USER = gql`
  {
    viewer {
      login
      name
    }
  }
`;

const Profile = () => (
  <Query query={GET_CURRENT_USER}>
    {({ data, loading }) => {
      const { viewer } = data;

      if (loading || !viewer) {
        return <Loading />;
      }

      const { name, login } = viewer;

      return (
        <div>
          {name} {login}
        </div>
      );
    }}
  </Query>
);

export default Profile;
