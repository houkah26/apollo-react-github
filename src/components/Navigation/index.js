import React from "react";
import { Link, withRouter } from "react-router-dom";

import * as routes from "../../constants/routes";

import "./index.css";
import OrganizationSearch from "./OrganizationSearch";

const Navigation = ({
  location: { pathname },
  organizationName,
  onOrganizationSearch
}) => (
  <header className="Navigation">
    <div className="Navigation-link">
      <Link
        className={pathname === routes.PROFILE ? "active" : ""}
        to={routes.PROFILE}
      >
        Profile
      </Link>
    </div>
    <div className="Navigation-link">
      <Link
        className={pathname === routes.ORGANIZATION ? "active" : ""}
        to={routes.ORGANIZATION}
      >
        Organization
      </Link>
    </div>
    {pathname === routes.ORGANIZATION && (
      <OrganizationSearch
        organizationName={organizationName}
        onOrganizationSearch={onOrganizationSearch}
      />
    )}
  </header>
);

export default withRouter(Navigation);
