import React, { Fragment } from "react";
import { Preloader } from "../../_common/Preloader";
import SearchFullDiamond from "./Items/SearchFullDiamond";
import SearchFullRing from "./Items/SearchFullRing";
import SearchFullBlog from "./Items/SearchFullBlog";
import { FeedListNextPageButton } from "../../_common/Buttons/FeedListItemButtons";
import InfiniteScroll from 'react-infinite-scroller';
import SearchFullCatalog from "./Items/SearchFullCatalog";

export default class SearchFullResultsList extends React.Component {
  constructor(props) {
    super(props);
    this.perPage = 20;
  }

  componentDidMount() {
    const { fetchData, query } = this.props;

    fetchData({
      query: query,
      page: 1,
      perPage: this.perPage
    });

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { fetchData, query } = this.props;
    const { status } = this.props.details;

    if (status === "none") {
      fetchData({
        query: query,
        page: 1,
        perPage: this.perPage
      });
    }
  }

  handleNextPage = () => {
    const { fetchNextPage, query } = this.props;
    const { pagination } = this.props.details;

  fetchNextPage({
    query: query,
    page: pagination.currentPage + 1,
    perPage: this.perPage
  });

  };

  render() {
    const { status, newItemsStatus, data, pagination } = this.props.details;
    const { currentTab, isMobile } = this.props;

    if (status === "request") {
      return <Preloader margin="265px auto" />;
    }

    let items;

    switch (currentTab) {
      case "diamond":
        items = data.map((item, index) => (
          <SearchFullDiamond
            data={item}
            type={currentTab}
            key={`search_diam${item.id}`}
            isMobile={isMobile}
            position={index + 1}
          />
        ));
        break;
      case "wedding":
      case "engagement":
        items = data.map((item, index) => (
          <SearchFullRing
            data={item}
            type={currentTab}
            key={`search_${item.id}`}
            isMobile={isMobile}
            position={index + 1}
          />
        ));

        break;
      case "blog":
        items = data.map(item => (
            <SearchFullBlog
                item={item}
                key={`search_blog${item.id}`}
                isMobile={isMobile}
            />
        ));
        break;
      case "pendant":
      case "earrings":
      case "bracelets":
        items = data.map((item, index) => (
            <SearchFullCatalog
                data={item}
                type={currentTab}
                key={`search_${item.id}`}
                isMobile={isMobile}
                position={index + 1}
            />
        ));

    }

    let loader =  (newItemsStatus === "request" && (
        <div key={0} className="row search-row">
          <div className="col">
            <Preloader margin="50px auto" />
          </div>
        </div>
    ));

    let stopLoading = +pagination.total === data.length ? false : true

    return (
      <Fragment>

        <div className="row search-row">
          <InfiniteScroll
              pageStart={1}
              loadMore={this.handleNextPage}
              hasMore={stopLoading}
              loader={loader}
              initialLoad={false}
          >
            <div className="row search-row">{items}</div>
          </InfiniteScroll>
        </div>


        {/*{newItemsStatus === "request" && (*/}
        {/*  <div className="row search-row">*/}
        {/*    <div className="col">*/}
        {/*      <Preloader margin="50px auto" />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}
        {/*{pagination.currentPage < pagination.lastPage && (*/}
        {/*  <FeedListNextPageButton*/}
        {/*    title={currentTab === "diamond" ? "diamonds" : "rings"}*/}
        {/*    handleClick={this.handleNextPage}*/}
        {/*    count={this.perPage}*/}
        {/*    newItemsStatus={newItemsStatus}*/}
        {/*    status={status}*/}
        {/*  />*/}
        {/*)}*/}
      </Fragment>
    );
  }
}
