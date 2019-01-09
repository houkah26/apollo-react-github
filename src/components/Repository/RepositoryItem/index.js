import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

import Link from "../../common/Link";
import Button from "../../common/Button";

import "./index.css";
import { REPOSITORY_FRAGMENT } from "../fragments";

const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
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

const updateStarCount = (client, repositoryId, add) => {
  const repository = client.readFragment({
    id: `Repository:${repositoryId}`,
    fragment: REPOSITORY_FRAGMENT
  });

  const totalCount = repository.stargazers.totalCount + (add ? 1 : -1);

  client.writeFragment({
    id: `Repository:${repositoryId}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount
      }
    }
  });
};

const updateWatchCount = (client, repositoryId, add) => {
  const repository = client.readFragment({
    id: `Repository:${repositoryId}`,
    fragment: REPOSITORY_FRAGMENT
  });

  const totalCount = repository.watchers.totalCount + (add ? 1 : -1);

  client.writeFragment({
    id: `Repository:${repositoryId}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount
      }
    }
  });
};

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
          update={client => updateStarCount(client, id, !viewerHasStarred)}
        >
          {(mutate, { data, loading, error }) => (
            <Button className="RepositoryItem-title-action" onClick={mutate}>
              {stargazers.totalCount} {viewerHasStarred ? "Unstar" : "Star"}
            </Button>
          )}
        </Mutation>

        <Mutation
          mutation={UPDATE_REPOSITORY_SUBSCRIPTION}
          variables={{
            id,
            state:
              viewerSubscription === "SUBSCRIBED"
                ? "UNSUBSCRIBED"
                : "SUBSCRIBED"
          }}
          update={client =>
            updateWatchCount(client, id, viewerSubscription !== "SUBSCRIBED")
          }
        >
          {(mutate, { data, loading, error }) => (
            <Button className="RepositoryItem-title-action" onClick={mutate}>
              {watchers.totalCount}{" "}
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
