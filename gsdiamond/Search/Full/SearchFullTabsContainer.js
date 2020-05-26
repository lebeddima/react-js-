import React from "react";
import { connect } from "react-redux";
import selectors from "../../_selectors/searchSelectors";
import SearchFullTabs from "./SearchFullTabs";

const mapStateToProps = (state, props) => ({
  tabsCount: selectors.tabCount(state),
  tabWithMaxCount: selectors.tabWithMaxCount(state),
  ...props
});

export default connect(mapStateToProps)(SearchFullTabs);
