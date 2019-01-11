import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import IssueItem from "../IssueItem";
import ErrorMessage from "../../common/Error";
import Loading from "../../common/Loading";
import Button from "../../common/Button";

import "./index.css";

const ISSUE_STATES = {
  NONE: "NONE",
  OPEN: "OPEN",
  CLOSED: "CLOSED"
};

class Issues extends React.Component {
  state = {
    issueState: ISSUE_STATES.NONE
  };

  onChangeIssueState = nextIssueState => {
    this.setState({ issueState: nextIssueState });
  };

  render() {
    const { issueState } = this.state;
    const { repositoryOwner, repositoryName } = this.props;

    return (
      <div className="Issues">
        <Button
          className="Button_unobtrusive"
          onClick={() => this.onChangeIssueState(TRANSITION_STATE[issueState])}
        >
          {TRANSITION_LABELS[issueState]}
        </Button>

        {isShow(issueState) && (
          <Query
            query={GET_ISSUES_OF_REPOSITORY}
            variables={{
              repositoryOwner,
              repositoryName
            }}
          >
            {({ data, loading, error }) => {
              if (error) {
                return <ErrorMessage error={error} />;
              }

              const { repository } = data;

              if (loading && !repository) {
                return <Loading />;
              }

              const filteredRepository = {
                issues: {
                  edges: repository.issues.edges.filter(
                    issue => issue.node.state === issueState
                  )
                }
              };

              if (!filteredRepository.issues.edges.length) {
                return <div className="IssueList">No issues ...</div>;
              }

              return <IssueList issues={filteredRepository.issues} />;
            }}
          </Query>
        )}
      </div>
    );
  }
}

const IssueList = ({ issues }) => (
  <div className="IssueList">
    {issues.edges.map(({ node }) => (
      <IssueItem key={node.id} issue={node} />
    ))}
  </div>
);

export default Issues;

const GET_ISSUES_OF_REPOSITORY = gql`
  query($repositoryOwner: String!, $repositoryName: String!) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5) {
        edges {
          node {
            id
            number
            state
            title
            url
            bodyHTML
          }
        }
      }
    }
  }
`;

const isShow = issueState => issueState !== ISSUE_STATES.NONE;

const TRANSITION_LABELS = {
  [ISSUE_STATES.NONE]: "Show Open Issues",
  [ISSUE_STATES.OPEN]: "Show Closed Issues",
  [ISSUE_STATES.CLOSED]: "Hide Issues"
};

const TRANSITION_STATE = {
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE
};
