import React from "react";
import { connect } from "react-redux";
import { saveCatalogSort } from "../../CatalogFeedActions";
import SortDropdown from "../../../Shared/ResultPanel/SortDropdown";

class CatalogSortDropdownContainer extends React.Component {
  render() {
    const { save } = this.props;
    return <SortDropdown save={save} />;
  }
}

const mapStateToProps = () => ({
  // input: diamondsFeedSortSelector(state),
});

export default connect(
  mapStateToProps,
  {
    save: saveCatalogSort
  }
)(CatalogSortDropdownContainer);
