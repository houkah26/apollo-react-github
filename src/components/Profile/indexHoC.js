import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import Loading from "../common/Loading";
import RepositoryList, { REPOSITORY_FRAGMENT } from "../Repository";
import ErrorMessage from "../common/Error";

const Profile = props => {
  const { data } = props;
  const { error, loading, fetchMore } = data;

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
      entry="viewer"
    />
  );
};

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

const config = {
  options: {
    notifyOnNetworkStatusChange: true
  }
};

export default graphql(GET_CURRENT_USER_REPOS, config)(Profile);

// export default compose(
//   graphql(gql`mutation (...) { ... }`, { name: 'createTodo' }),
//   graphql(gql`mutation (...) { ... }`, { name: 'updateTodo' }),
//   graphql(gql`mutation (...) { ... }`, { name: 'deleteTodo' }),
// )(MyComponent);

// function MyComponent(props) {
//   // Instead of the default prop name, `mutate`,
//   // we have three different prop names.
//   console.log(props.createTodo);
//   console.log(props.updateTodo);
//   console.log(props.deleteTodo);

//   return null;
// }

// const QueryOne = gql`
//   query One {
//     one
//   }
// `;

// const QueryTwo = gql`
//   query Two {
//     two
//   }
// `;

// const withOne = graphql(QueryOne, {
//   props: ({ data }) => ({
//     loadingOne: data.loading,
//     one: data.one
//   }),
// });

// const withTwo = graphql(QueryTwo, {
//   props: ({ data }) => ({
//     loadingTwo: data.loading,
//     two: data.two
//   }),
// });

// const Numbers = ({ loadingOne, loadingTwo, one, two }) => {
//   if (loadingOne || loadingTwo) return <span>loading...</span>
//   return <h3>{one} is less than {two}</h3>
// };

// const NumbersWithData = compose(withOne, withTwo)(Numbers);
