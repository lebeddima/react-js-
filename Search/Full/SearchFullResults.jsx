import React, { Fragment } from "react";
import SearchFullTabsContainer from "./SearchFullTabsContainer";
import { connect } from "react-redux";
import selectors from "../../_selectors/searchSelectors";
import SearchFullResultsListContainer from "./SearchFullResultsListContainer";
import { Preloader } from "../../_common/Preloader";
import SearchFullNoResult from "./SearchFullNoResult";

class SearchFullResults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: null
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.query !== this.props.query) {
      this.setState({
        tab: null
      });
    }
  }

  handleSelectTab = tab => {
    this.setState({ tab });
  };

  render() {
    const { tabStatus, totalResults } = this.props;
    const { tab } = this.state;

    if (tabStatus === "none") {
      return <SearchFullNoResult />;
    }

    if (tabStatus === "request") {
      return <Preloader margin="300px auto" />;
    }
    return (
      <Fragment>
        <SearchFullTabsContainer
          currentTab={tab}
          handleChange={this.handleSelectTab}
        />
        {tab && totalResults !== 0 && (
          <SearchFullResultsListContainer currentTab={tab} />
        )}
        {totalResults === 0 && <SearchFullNoResult />}
      </Fragment>
    );
  }
}

const mapStateToProps = (state, props) => ({
  query: selectors.query(state),
  tabStatus: selectors.tabStatus(state),
  totalResults: selectors.totalResults(state)
});

export default connect(mapStateToProps)(SearchFullResults);
