import React from "react";
import { connect } from "react-redux";
import selectors from "../../_selectors/favoriteSelectors";
import DiamondFavItem from "./DiamondFavItem";
import {
  removeDiamondFromFav,
  removeEngagementFromFav,
  removeWeddingFromFav,
  removeProductFromFav, removePendantFromFav, removeEarringFromFav, removeBraceletFromFav
} from "../FavoriteActions";
import { Preloader } from "../../_common/Preloader";
import RingFavItem from "./RingFavItem";
import ProductFavItem from "./ProductFavItem";

const listStyle = { minHeight: "80vh" };

class FavoriteList extends React.Component {
  render() {
    const {
      data,
      status,
      currentTab,
      removeDiamondFromFav,
      removeEngagementFromFav,
      removeWeddingFromFav,
      removeEarringFromFav,
      removeBraceletFromFav,
      removePendantFromFav,
    } = this.props;

    if (currentTab === null) {
      return "Select tab";
    }

    if (status === "request") {
      return (
        <div className="row fav-list-row" style={listStyle}>
          <Preloader margin="0 400px" />
        </div>
      );
    }

    let items = [];
    const category = data[currentTab].items;

    switch (currentTab) {
      case "diamond":
        items = category.map((item, index) => (
          <DiamondFavItem
            data={item}
            removeAction={removeDiamondFromFav}
            currentTab={currentTab}
            key={`${item.id}_diamond_fav`}
            position={index + 1}
          />
        ));
        break;
      case "engagement":
        items = category.map((item, index) => (
          <RingFavItem
            data={item}
            removeAction={removeEngagementFromFav}
            currentTab={currentTab}
            key={`${item.id}_engagement_fav`}
            position={index + 1}
          />
        ));
        break;
      case "wedding":
        items = category.map((item, index) => (
          <RingFavItem
            data={item}
            removeAction={removeWeddingFromFav}
            currentTab={currentTab}
            key={`${item.id}_wedding_fav`}
            position={index + 1}
          />
        ));
        break;
      case "pendant":
        items = category.map((item, index) => (
            <ProductFavItem
                data={item}
                removeAction={removePendantFromFav}
                currentTab={currentTab}
                key={`${item.id}_pendant_fav`}
                position={index + 1}
            />
        ));
        break;
      case "earring":
        items = category.map((item, index) => (
            <ProductFavItem
                data={item}
                removeAction={removeEarringFromFav}
                currentTab={currentTab}
                key={`${item.id}_earrings_fav`}
                position={index + 1}
            />
        ));
        break;
      case "bracelet":
        items = category.map((item, index) => (
            <ProductFavItem
                data={item}
                removeAction={removeBraceletFromFav}
                currentTab={currentTab}
                key={`${item.id}_bracelets_fav`}
                position={index + 1}
            />
        ));
        break;
    }

    if (!items.length) {
      return (
        <div
          className="row fav-list-row"
          style={{
            height: "60vh",
            padding: "20vh 0",
            justifyContent: "center"
          }}
        >
          <div className="section-title">No items</div>
        </div>
      );
    }

    return <div className="row fav-list-row">{items}</div>;
  }
}

const mapStateToProps = (state, props) => ({
  data: selectors.data(state),
  status: selectors.status(state),
  ...props
});

const mapDispatchToProps = {
  removeDiamondFromFav,
  removeEngagementFromFav,
  removeWeddingFromFav,
  removeProductFromFav,
  removeEarringFromFav,
  removeBraceletFromFav,
  removePendantFromFav
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoriteList);
