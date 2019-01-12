import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Loading from "../common/Loading";
import RepositoryList, { REPOSITORY_FRAGMENT } from "../Repository";
import ErrorMessage from "../common/Error";

class ProfileContainer extends React.Component {}

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
          entry="viewer"
        />
      );
    }}
  </Query>
);

export default Profile;

// const GET_CURRENT_USER_REPOS = gql`
//   query($cursor: String) {
//     viewer {
//       repositories(
//         first: 5
//         orderBy: { direction: DESC, field: STARGAZERS }
//         after: $cursor
//       ) {
//         edges {
//           node {
//             ...repository
//           }
//         }
//         pageInfo {
//           endCursor
//           hasNextPage
//         }
//       }
//     }
//   }

//   ${REPOSITORY_FRAGMENT}
// `;

// import React, { Component } from 'react';
// import { ApolloConsumer } from 'react-apollo';

// class DelayedQuery extends Component {
//   state = { dog: null };

//   onDogFetched = dog => this.setState(() => ({ dog }));

//   render() {
//     return (
//       <ApolloConsumer>
//         {client => (
//           <div>
//             {this.state.dog && <img src={this.state.dog.displayImage} />}
//             <button
//               onClick={async () => {
//                 const { data } = await client.query({
//                   query: GET_DOG_PHOTO,
//                   variables: { breed: "bulldog" }
//                 });
//                 this.onDogFetched(data.dog);
//               }}
//             >
//               Click me!
//             </button>
//           </div>
//         )}
//       </ApolloConsumer>
//     );
//   }
// }
