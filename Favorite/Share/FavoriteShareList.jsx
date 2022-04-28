import React from "react";
import DiamondFavItem from "../Items/DiamondFavItem";
import { Preloader } from "../../_common/Preloader";
import RingFavItem from "../Items/RingFavItem";

const listStyle = { minHeight: "80vh" };

export default class FavoriteShareList extends React.Component {
  render() {
    const { data, status, currentTab } = this.props;

    if (status === "request") {
      return (
        <div className="row fav-list-row" style={listStyle}>
          <Preloader margin="0 400px" />
        </div>
      );
    }

    let items = [];

    switch (currentTab) {
      case "diamond":
        items = data.map(item => (
          <DiamondFavItem
            data={item}
            currentTab={currentTab}
            key={`${item.id}_diamond_fav`}
          />
        ));
        break;
      case "engagement":
        items = data.map(item => (
          <RingFavItem
            data={item}
            currentTab={currentTab}
            key={`${item.id}_engagement_fav`}
          />
        ));
        break;
      case "wedding":
        items = data.map(item => (
          <RingFavItem
            data={item}
            currentTab={currentTab}
            key={`${item.id}_wedding_fav`}
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

    return (
      <div className="row fav-list-row" style={listStyle}>
        {items}
      </div>
    );
  }
}
