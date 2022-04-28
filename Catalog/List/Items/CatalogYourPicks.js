import React from "react";
import RingListSlider from "../../../../_common/RingsSlider/RingListSlider";
import withFetch from "../../../../_common/HOC/WithFetch";
import api from "../../../../../config/api";

class CatalogYourPicks extends React.Component {
  render() {
    const data = {
      title: "Your picks",
      products: this.props.data ? this.props.data.data : []
    };

    return <RingListSlider {...this.props} type="engagement" data={data} />;
  }
}

export default withFetch(api.engagementFeed.getYourPicks)(CatalogYourPicks);
