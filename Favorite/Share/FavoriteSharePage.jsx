import React, { Fragment } from "react";
import routing from "../../../config/routing";
import Breadcrumbs from "../../_common/Breadcrumbs/Breadcrumbs";
import SubscribeBlock from "../../_common/SubscribeBlock/SubscribeBlock";
import SubscribeContainer from "../../_common/Subscribe/SubscribeContainer";
import SocialBlock from "../../_common/SocialBlock/SocialBlock";
import ExpertChoiceBlock from "../../_common/ExpertChoiceBlock/ExpertChoiceBlock";
import OnlineHelpBlock from "../../_common/OnlineHelpBlock/OnlineHelpBlock";
import FavoriteShareBlock from "./FavoriteShareBlock";

class FavoriteSharePage extends React.Component {
  render() {
    return (
      <Fragment>
        <Breadcrumbs
          marks={[
            { title: "Favourites", path: routing().favorite },
            { title: "Share" }
          ]}
        />
        <FavoriteShareBlock
          matchParams={this.props.match.params}
          history={this.props.history}
        />
        <OnlineHelpBlock />
        <ExpertChoiceBlock />
        <SubscribeContainer Component={SubscribeBlock} />
        <SocialBlock />
      </Fragment>
    );
  }
}

export default FavoriteSharePage;
