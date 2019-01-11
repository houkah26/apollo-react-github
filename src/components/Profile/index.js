import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Loading from "../common/Loading";
import RepositoryList, { REPOSITORY_FRAGMENT } from "../Repository";
import ErrorMessage from "../common/Error";

const Profile = () => (
  <Query query={GET_CURRENT_USER_REPOS} notifyOnNetworkStatusChange={true}>
    {({ data, loading, error, fetchMore }) => {
      if (error) {
        console.error(error);
        return <ErrorMessage error={error} />;
      }

      const { viewer } = data;

      if (loading && !viewer) {
        return <Loading />;
      }

      return (
        <RepositoryList
          repositories={viewer.repositories}
          fetchMore={fetchMore}
          loading={loading}
        />
      );
    }}
  </Query>
);

export default Profile;

const GET_CURRENT_USER_REPOS = gql`
  query($cursor: String) {
    viewer {
      repositories(
        first: 5
        orderBy: { direction: DESC, field: STARGAZERS }
        after: $cursor
      ) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }

  ${REPOSITORY_FRAGMENT}
`;
