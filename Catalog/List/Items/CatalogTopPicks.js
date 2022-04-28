import React from "react";
import RingListSlider from "../../../../_common/RingsSlider/RingListSlider";
import withFetch from "../../../../_common/HOC/WithFetch";
import api from "../../../../../config/api";

class CatalogTopPicks extends React.Component {
  render() {
    const { data } = this.props;
    const formattedData = data ? { ...data.data } : {};
    return (
      <RingListSlider {...this.props} type="engagement" data={formattedData} />
    );
  }
}

export default withFetch(api.engagementFeed.getTopPicks)(CatalogTopPicks);
