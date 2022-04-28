import React from "react";
import SearchQuickResultsWrapper from "./SearchQuickResultsWrapper";
import { Link } from "react-router-dom";
import routing from "../../../config/routing";

const SearchQuickFeatures = () => (
  <SearchQuickResultsWrapper title="Featured searches">
    <div className="search-preview">
      <div className="features-search">
        <div className="features-search__row">
          <Link to={routing().diamondsFeed}>
            <div className="search-label">Diamonds</div>
          </Link>
          <Link to={routing().engagementFeed}>
            <div className="search-label">Engagement rings</div>
          </Link>
          <Link to={routing().weddingFeed}>
            <div className="search-label">Wedding rings</div>
          </Link>
          <Link to={"/jewellery/pendant"}>
            <div className="search-label">Pendant</div>
          </Link>
          <Link to={"/jewellery/earrings"}>
            <div className="search-label">Earrings</div>
          </Link>
          <Link to={"/jewellery/bracelets"}>
            <div className="search-label">Bracelets</div>
          </Link>
          <Link to={routing().blog}>
            <div className="search-label">Blog</div>
          </Link>
        </div>
      </div>
    </div>
  </SearchQuickResultsWrapper>
);

export default SearchQuickFeatures;
