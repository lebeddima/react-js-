import React from "react";
import closeSvg from "../../../img/svg/close.svg";
import { flowRight as compose } from "lodash";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import SearchQuickInput from "./SearchQuickInput";
import { fetchQuickSearch } from "../SearchActions";
import selectors from "../../_selectors/searchSelectors";
import SearchQuickFeatures from "./SearchQuickFeatures";
import SearchQuickNoResults from "./SearchQuickNoResults";
import SearchQuickPreloader from "./SearchQuickPreloader";
import SearchQuickBlogResults from "./SearchQuickBlogResults";
import { deviceSelector } from "../../_selectors/deviceSelector";
import SearchQuickProductsResults from "./SearchQuickProductsResults";
import SearchQuickLink from "./SearchQuickLink";
import ReactDOM from 'react-dom';

class SearchQuickModal extends React.Component {
  constructor(props) {
    super(props);

    this.wrapper = React.createRef();
  }

  componentDidMount() {
    this.wrapper.current.addEventListener("click", this.closeModalHandler);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const path = this.props.location.pathname + this.props.location.search;
    const oldPath = prevProps.location.pathname + prevProps.location.search;

    if (path !== oldPath) {
      this.props.handleModal();
    }
  }

  componentWillUnmount() {
    this.wrapper.current.removeEventListener("click", this.closeModalHandler);
    this.props.clearState();
  }

  closeModalHandler = ({ target }) => {
    if (!target.closest(".search-window")) {
      this.props.handleModal();
    }
  };

  render() {
    const {
      handleModal,
      search,
      haveResults,
      status,
      blog,
      products,
      isMobile,
      query,
      history
    } = this.props;

    const convertObjToArray = status === "success" && !products.push ?
      Object.values(products) : [];

    const template = (
      <div className="modal-wrapper active" ref={this.wrapper}>
        <div className="modal-wrapper__inner">
          <div className="container">
            <div className="search-window">
              <button className="close-nav sm-show" onClick={handleModal}>
                <img src={closeSvg} alt="" />
              </button>
              <p className="modal-title sm-show">Search</p>
              <div className="main-search">
                <SearchQuickInput
                  search={search}
                  clear={clearState}
                  query={query}
                  status={status}
                  push={history.push}
                  haveResults={haveResults}
                />
                {!haveResults && <SearchQuickFeatures />}
                {!haveResults && status === "success" && convertObjToArray.length === 0 && (
                  <SearchQuickNoResults />
                )}
                {status === "request" && <SearchQuickPreloader />}
                {status === "success" && blog.length !== 0 && (
                  <SearchQuickBlogResults data={blog} isMobile={isMobile} />
                )}
                {status === "success" && !!products.push && products.length !== 0 && (
                  <SearchQuickProductsResults data={products} />
                )}
                {!products.push ? <SearchQuickProductsResults data={convertObjToArray} /> : null}
              </div>

              {haveResults && status === "success" && (
                <SearchQuickLink query={query} />
              )}
            </div>
          </div>
        </div>
      </div>
    );

    return ReactDOM.createPortal(template, document.getElementById("root"));
  }
}

const mapStateToProps = (state, props) => ({
  handleModal: props.handleModal,
  isMobile: deviceSelector(state),
  query: selectors.quickQuery(state),
  status: selectors.quickStatus(state),
  haveResults: selectors.quickHaveResults(state),
  blog: selectors.quickBlogData(state),
  products: selectors.quickProductsData(state)
});

const clearState = fetchQuickSearch.fulfill;

const mapDispatchToProps = {
  search: fetchQuickSearch,
  clearState
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SearchQuickModal);
