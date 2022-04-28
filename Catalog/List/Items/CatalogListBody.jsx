import React, { Fragment } from "react";

import { Preloader } from "../../../../_common/Preloader";
import ProductPaneItem from "../../../Shared/Other/ProductPaneItem";
import ProductListItem from "../../../Shared/Other/ProductListItem";
// import RingListItem from "../../../Shared/Rings/RingListItem";
// import EngagementTopPicks from "./GeneralTopPicks";
import GoogleEE from '../../../../_common/GoogleEE/GoogleEE';
import api from "../../../../../config/api";
// import ListBanner from "../../../Shared/ListBanner";

export default class CatalogListBody extends React.Component {
  state = {
    banners: [],
    isFetched: false
  };

  componentDidMount() {
    api.diamondsFeed
      .getPromoBlocks('engagement-rings-feed')
      .then(res => {
        if (res.status === 200) {
          this.setState({
            banners: res.data,
            isFetched: true
          });
        }
      })
      .catch(e => {
        console.log('fetch banners is error', e)
      });
  }
  

  render() {
    const {
      itemsSku,
      status,
      newItemsStatus,
      data,
      // isMobile,
      view,
      currentSize,
      catalogType,
      setCatalogCategory
    } = this.props;
    // const { isFetched, banners } = this.state;


    if (status === "request") {
      return (
        <div className="list-body">
          <Preloader margin={"25vh 0 150vh 0"} />
        </div>
      );
    }

    const items = itemsSku.map((group_sku, index) => {
      if (view === 'pane') {
        return (
          <ProductPaneItem
            type={catalogType}
            data={data[group_sku]}
            currentSize={currentSize}
            key={group_sku}
            list={GoogleEE.LIST_FEED}
            position={index + 1}
            setCatalogCategory={setCatalogCategory}
          />
        )
      } else {
        return (
          <ProductListItem
            type={catalogType}
            data={data[group_sku]}
            currentSize={currentSize}
            key={group_sku}
            list={GoogleEE.LIST_FEED}
            position={index + 1}
            setCatalogCategory={setCatalogCategory}
          />
        )
      }
    });

    return (
      <div className="row justify-content-center ring-row">
        {items}
        {newItemsStatus === "request" && <Preloader />}
      </div>
    )

  }
}
