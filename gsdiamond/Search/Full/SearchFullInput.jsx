import React, { Fragment } from "react";
import HeaderSearchSvg from "../../../img/jsSvg/HeaderSearchSvg";
import { flowRight as compose } from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import selectors from "../../_selectors/searchSelectors";
import { saveSearchQuery } from "../SearchActions";
import routing from "../../../config/routing";
import notification from "../../../utils/notification";

class SearchFullInput extends React.Component {
  constructor(props) {
    super(props);

    this.input = React.createRef();
  }

  componentDidMount() {
    this.handleCheckUrl();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const oldUrl = prevProps.location.pathname + prevProps.location.search;
    const newUrl = this.props.location.pathname + this.props.location.search;

    if (prevProps.query !== this.props.query || oldUrl !== newUrl) {
      this.handleCheckUrl();
    }
  }

  handleCheckUrl = () => {
    this.input.current.focus();
    const { location, history, saveSearchQuery } = this.props;
    const { search } = location;

    const param = search.slice(0, 3);
    const query = decodeURI(search.slice(3));

    if (param === "?q=" && query.length) {
      saveSearchQuery({ query, push: history.push });
      let parseQuery = query.split('&')[0];
      this.input.current.value = parseQuery;
    } else {
      history.replace(routing().search);
    }
  };

  handleSearch = () => {
    const { saveSearchQuery, history, query } = this.props;
    const value = this.input.current.value;

    if (value.length >= 3) {
      if (query !== value) {
        saveSearchQuery({ query: value, push: history.push });
      }
    } else {
      notification("info", "The search query is too short");
    }
  };

  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.handleSearch();
    }
  };

  render() {
    const { query, totalCount, status } = this.props;
    return (
      <Fragment>
        <p className="section-title section-title--type2">
          Search results for: <span className="search-val">{query.split('&')[0]}</span>
        </p>
        <div className="general-search">
          <input
            type="text"
            className="general-search__field"
            ref={this.input}
            onKeyPress={this.handleKeyPress}
            placeholder="Search..."
          />
          <span className="general-search__icon" onClick={this.handleSearch}>
            <HeaderSearchSvg />
          </span>
        </div>
        {status === "request" && (
          <p className="general-result-count">Searching...</p>
        )}
        {status === "success" && (
          <p className="general-result-count">
            {totalCount ? `${totalCount} results found` : "We have not found"}
          </p>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state, props) => ({
  query: selectors.query(state),
  status: selectors.tabStatus(state),
  totalCount: selectors.totalResults(state),
  ...props
});

const mapDispatchToProps = {
  saveSearchQuery
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SearchFullInput);
