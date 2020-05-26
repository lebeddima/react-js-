import React from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { flowRight as compose } from "lodash";
import { deviceSelector } from "../../../_selectors/deviceSelector";
import selector from "../../../_selectors/catalogFeedSelectors";
import {
  fetchCatalogFeed,
  fetchCatalogFeedNextPage, setCatalogCategory
} from "../CatalogFeedActions";
import CatalogResultPanel from "./Items/CatalogResultPanel";
import CatalogListBody from "./Items/CatalogListBody";
// import CatalogYourPicks from "./Items/CatalogYourPicks";
import { isEqual } from "lodash";
import MetaH1 from "../../../_common/SEO/MetaH1";
import RingConstructor from '../../../_common/RingConstructor/RingConstructor';
import { FeedListNextPageButton } from "../../../_common/Buttons/FeedListItemButtons";

class CatalogFeedListContainer extends React.Component {
  constructor(props) {
    super(props);

    this.mobilePerPage = 25;
    this.desktopPerPage = 50;

    this.state = {
      view: "pane",
    };
  }

  handleChangeView = view => {
    this.setState({
      view: view
    });
  };

  componentDidMount() {
    const {filtersStatus, inputData, isMobile, status, match} = this.props;
    // if (filtersStatus === "success" && status !== "success") {
    this.props.fetch({
      slug: match.params.catalog,
      input: inputData,
      page: 1,
      perPage: isMobile ? this.mobilePerPage : this.desktopPerPage
    });
  // }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isMobile, inputData, match } = this.props;

    if (!isEqual(inputData, prevProps.inputData) ||
      prevProps.match.params.catalog !== match.params.catalog) {
      // this.props.fetch({page: match.params.catalog});
      this.props.fetch({
        slug: match.params.catalog,
        page: 1,
        perPage: isMobile ? this.mobilePerPage : this.desktopPerPage
      });

    }
  }

  componentWillUnmount() {
    if (RingConstructor.diamondId) {
      this.props.clearData();
    }
  }

  loadNextPage = () => {
    const { pagination, isMobile, match } = this.props;

    this.props.fetchNext({
      slug: match.params.catalog,
      page: pagination.currentPage + 1,
      perPage: isMobile ? this.mobilePerPage : this.desktopPerPage
    });
  };

  render() {
    const { view } = this.state;
    const {
      status,
      pagination,
      data,
      isMobile,
      newItemsStatus,
      itemsSku,
      currentSize,
      handleModal,
      forwardRef,
      metaSlug,
      catalogType,
      setCatalogCategory
    } = this.props;

    let parseType = catalogType.includes('s') ? catalogType.slice(0, catalogType.length - 1) : catalogType;

    return (
      <div className="col-lg-8 col-xl-9" ref={forwardRef}>
        <MetaH1
          slug={metaSlug}
          defaultTitle={catalogType}
          className="section-title section-title--type2"
        />
        <div className="expert-btn sm-show">
          <button className="theme-btn " onClick={handleModal}>
            Filter
          </button>
          <button className="theme-btn theme-btn--chat">
            Chat with expert
          </button>
        </div>
        <CatalogResultPanel
          total={pagination.total}
          view={view}
          changeView={this.handleChangeView}
          type={parseType}
        />
        <div className="listings-wrap">
          <div className="list-body" style={{minHeight: '700px'}}>
            <CatalogListBody
              view={view}
              data={data}
              itemsSku={itemsSku}
              status={status}
              newItemsStatus={newItemsStatus}
              currentSize={currentSize}
              setCatalogCategory={setCatalogCategory}
              catalogType={parseType}
            />
            {pagination.currentPage < pagination.lastPage && (
              <FeedListNextPageButton
                title="rings"
                handleClick={this.loadNextPage}
                isMobile={isMobile}
                countMobile={this.mobilePerPage}
                count={this.desktopPerPage}
                newItemsStatus={newItemsStatus}
                status={status}
              />
            )}
          </div>
          {/*<CatalogYourPicks currentSize={currentSize} />*/}
        </div>
      </div>
    );
  }
}

const clearData = fetchCatalogFeed.fulfill;

const mapStateToProps = (state, props) => ({
  itemsSku: selector.getItemsGroupSku(state),
  status: selector.dataStatus(state),
  newItemsStatus: selector.newDataStatus(state),
  filtersStatus: selector.filterStatus(state),
  data: selector.feedDataObject(state),
  pagination: selector.pagination(state),
  isMobile: deviceSelector(state),
  inputData: selector.filterInput(state),
  currentSize: selector.filterSizeInput(state),
  handleModal: props.handleModal,
  forwardRef: props.forwardRef,
  metaSlug: props.metaSlug
  // filterKeys: getDiamondsFeedFilterInputIsActive(state),
});

const mapDispatchToProps = {
  fetch: fetchCatalogFeed,
  fetchNext: fetchCatalogFeedNextPage,
  clearData,
  setCatalogCategory
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CatalogFeedListContainer);
