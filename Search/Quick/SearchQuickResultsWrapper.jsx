import React, { Fragment } from "react";

const SearchQuickResultsWrapper = ({ title, type, children }) => (
  <Fragment>
    <p className="theme-subtitle theme-subtitle--smaller main-search__title">
      {title}:
    </p>
    {children}
  </Fragment>
);

export default SearchQuickResultsWrapper;
