import React from "react";

import Loading from "../common/Loading";
import Button from "../common/Button";

import "./index.css";

const FetchMore = ({
  loading,
  hasNextPage,
  variables,
  updateQuery,
  fetchMore,
  children
}) => (
  <div className="FetchMore">
    {loading ? (
      <Loading />
    ) : (
      hasNextPage && (
        <Button
          type="button"
          className="FetchMore-button Button_unobtrusive"
          onClick={() => fetchMore({ variables, updateQuery })}
        >
          More {children}
        </Button>
      )
    )}
  </div>
);

export default FetchMore;
