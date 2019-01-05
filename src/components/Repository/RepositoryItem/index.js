import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

import Link from "../../common/Link";
import Button from "../../common/Button";

import "./index.css";

const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
        stargazers {
          totalCount
        }
      }
    }
  }
`;

const UNSTAR_REPOSITORY = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
        stargazers {
          totalCount
        }
      }
    }
  }
`;

const UPDATE_REPOSITORY_SUBSCRIPTION = gql`
  mutation($id: ID!, $state: SubscriptionState!) {
    updateSubscription(input: { subscribableId: $id, state: $state }) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const RepositoryItem = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred
}) => (
  <div>
    <div className="RepositoryItem-title">
      <h2>
        <Link href={url}>{name}</Link>
      </h2>

      <div>
        <Mutation
          mutation={viewerHasStarred ? UNSTAR_REPOSITORY : STAR_REPOSITORY}
          variables={{ id }}
        >
          {(mutate, { data, loading, error }) => (
            <Button className="RepositoryItem-title-action" onClick={mutate}>
              {stargazers.totalCount} {viewerHasStarred ? "Unstar" : "Star"}
            </Button>
          )}
        </Mutation>
        {/* !viewerHasStarred ? (
          <Mutation mutation={STAR_REPOSITORY} variables={{ id }}>
            {(addStar, { data, loading, error }) => (
              <Button className="RepositoryItem-title-action" onClick={addStar}>
                {stargazers.totalCount} Star
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation mutation={UNSTAR_REPOSITORY} variables={{ id }}>
            {(removeStar, { data, loading, error }) => (
              <Button
                className="RepositoryItem-title-action"
                onClick={removeStar}
              >
                {stargazers.totalCount} Unstar
              </Button>
            )}
          </Mutation>
        ) */}
        <Mutation
          mutation={UPDATE_REPOSITORY_SUBSCRIPTION}
          variables={{
            id,
            state:
              viewerSubscription === "SUBSCRIBED"
                ? "UNSUBSCRIBED"
                : "SUBSCRIBED"
          }}
        >
          {(mutate, { data, loading, error }) => (
            <Button className="RepositoryItem-title-action" onClick={mutate}>
              {viewerSubscription === "SUBSCRIBED" ? "Unwatch" : "Watch"}
            </Button>
          )}
        </Mutation>
      </div>
    </div>

    <div className="RepositoryItem-description">
      <div
        className="RepositoryItem-description-info"
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />
      <div className="RepositoryItem-description-details">
        <div>
          {primaryLanguage && <span>Language: {primaryLanguage.name}</span>}
        </div>
        <div>
          {owner && (
            <span>
              Owner: <a href={owner.url}>{owner.login}</a>
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default RepositoryItem;
