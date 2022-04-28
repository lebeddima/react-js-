import React from "react";
import { connect } from "react-redux";
import selectors from "../../_selectors/searchSelectors";
import {
  fetchBlogNextPageSearch,
  fetchBlogSearch,
  fetchDiamondNextPageSearch,
  fetchDiamondSearch,
  fetchEngagementNextPageSearch,
  fetchEngagementSearch,
  fetchWeddingNextPageSearch,
  fetchWeddingSearch,

    fetchBraceletsSearch,
    fetchEarringsSearch,
    fetchPendantSearch,
    fetchBraceletsNextPageSearch,
    fetchEarringsNextPageSearch,
    fetchPendantNextPageSearch,
} from "../SearchActions";
import SearchFullResultsList from "./SearchFullResultsList";
import { deviceSelector } from "../../_selectors/deviceSelector";

class SearchFullResultsListContainer extends React.Component {
  render() {
    const {
      isMobile,
      currentTab,
      details,
      query,

      fetchDiamondSearch,
      fetchEngagementSearch,
      fetchWeddingSearch,
      fetchBlogSearch,
      fetchPendantSearch,
      fetchEarringsSearch,
      fetchBraceletsSearch,


      fetchDiamondNextPageSearch,
      fetchEngagementNextPageSearch,
      fetchWeddingNextPageSearch,
      fetchBlogNextPageSearch,
      fetchPendantNextPageSearch,
      fetchEarringsNextPageSearch,
      fetchBraceletsNextPageSearch,
    } = this.props;

    let fetchData, fetchNextPage;

    switch (currentTab) {
      case "diamond":
        fetchData = fetchDiamondSearch;
        fetchNextPage = fetchDiamondNextPageSearch;
        break;
      case "engagement":
        fetchData = fetchEngagementSearch;
        fetchNextPage = fetchEngagementNextPageSearch;
        break;
      case "wedding":
        fetchData = fetchWeddingSearch;
        fetchNextPage = fetchWeddingNextPageSearch;
        break;
      case "blog":
        fetchData = fetchBlogSearch;
        fetchNextPage = fetchBlogNextPageSearch;
        break;
      case "pendant":
        fetchData = fetchPendantSearch;
        fetchNextPage = fetchPendantNextPageSearch;
        break;
      case "earrings":
        fetchData = fetchEarringsSearch;
        fetchNextPage = fetchEarringsNextPageSearch;
        break;
      case "bracelets":
        fetchData = fetchBraceletsSearch;
        fetchNextPage = fetchBraceletsNextPageSearch;
        break;
    }

    return (

      <SearchFullResultsList
        query={query}
        details={details}
        currentTab={currentTab}
        fetchData={fetchData}
        fetchNextPage={fetchNextPage}
        isMobile={isMobile}
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  query: selectors.query(state),
  currentTab: props.currentTab,
  details: selectors.detailsTab(state, props.currentTab),
  isMobile: deviceSelector(state)
});

const mapDispatchToProps = {
  fetchDiamondSearch,
  fetchEngagementSearch,
  fetchWeddingSearch,
  fetchBlogSearch,
  fetchBraceletsSearch,
  fetchEarringsSearch,
  fetchPendantSearch,

  fetchBraceletsNextPageSearch,
  fetchEarringsNextPageSearch,
  fetchPendantNextPageSearch,
  fetchDiamondNextPageSearch,
  fetchEngagementNextPageSearch,
  fetchWeddingNextPageSearch,
  fetchBlogNextPageSearch
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchFullResultsListContainer);
