import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { flowRight as compose } from "lodash";
import selectors from "../../_selectors/favoriteSelectors";
import {
  removeAllDiamondFromFav,
  removeAllEngagementFromFav,
  removeAllWeddingFromFav,
  addDiamondsFromFavToCompare,
  addEngagementsFromFavToCompare,
  addWeddingsFromFavToCompare
} from "../FavoriteActions";
import ActionsBlock from "../../_common/CompareAndFavorites/ActionsBlock";
import ActionsBlockMobile from "../../_common/CompareAndFavorites/ActionsBlockMobile";

class ActionsBlockContainer extends React.Component {
  render() {
    const { isMobile } = this.props;
    return isMobile ? (
      <ActionsBlockMobile {...this.props} />
    ) : (
      <ActionsBlock {...this.props} />
    );
  }
}

const mapStateToProps = (state, props) => ({
  tabsCount: {
    diamond: selectors.tabCount(state, "diamond"),
    engagement: selectors.tabCount(state, "engagement"),
    wedding: selectors.tabCount(state, "wedding")
  },
  type: "favorite",
  isMobile: props.isMobile,
  ...props
});

const mapDispatchToProps = {
  removeDiamonds: removeAllDiamondFromFav,
  removeEngagements: removeAllEngagementFromFav,
  removeWeddings: removeAllWeddingFromFav,

  addAllDiamonds: addDiamondsFromFavToCompare,
  addAllEngagements: addEngagementsFromFavToCompare,
  addAllWeddings: addWeddingsFromFavToCompare
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ActionsBlockContainer);
