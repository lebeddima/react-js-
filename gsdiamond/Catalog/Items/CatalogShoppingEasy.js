import React from "react";
import ShoppingEasyBlock from "../../Shared/ShoppingEasyBlock";
import { connect } from 'react-redux';
import selectors from '../../../_selectors/engagementFeedSelectors';
import { fetchCatalogShoppingEasy } from '../CatalogFeedActions';

const mapStateToProps = (state) => {
  const { status, data } = selectors.shoppingEasy(state);

  return { status, data }
};

const mapDispatchToProps = {
  fetchData: fetchCatalogShoppingEasy
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingEasyBlock);
