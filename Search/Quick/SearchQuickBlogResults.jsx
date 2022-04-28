import React from "react";
import SearchQuickResultsWrapper from "./SearchQuickResultsWrapper";
import { Link } from "react-router-dom";
import routing from "../../../config/routing";

const BlogItem = ({ slug, title }) => (
  <div className="col-6 col-lg-3 article-result">
    <p className="article-result__title">{title}</p>
    <Link to={routing(slug).blogArticle} className="article-result__more">
      Read more
    </Link>
  </div>
);

const SearchQuickBlogResults = ({ data, isMobile }) => {
  const articles = data
    .slice(0, isMobile ? 2 : 4)
    .map(item => (
      <BlogItem
        slug={item.slug}
        title={item.title}
        key={`search_blog_${item.id}`}
      />
    ));

  return (
    <SearchQuickResultsWrapper title="Results Blog">
      <div className="search-preview search-preview--blog">
        <div className="row">{articles}</div>
      </div>
    </SearchQuickResultsWrapper>
  );
};

export default SearchQuickBlogResults;
