import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../_common/Breadcrumbs/Breadcrumbs";
import routing from "../../../config/routing";
import SocialBlock from "../../_common/SocialBlock/SocialBlock";
import SubscribeContainer from "../../_common/Subscribe/SubscribeContainer";
import SubscribeBlock from "../../_common/SubscribeBlock/SubscribeBlock";
import YourOrderIncludesBlock from "../../Product/Shared/YourOrderIncludesBlock";

import banner from "../../../img/jewellery/1.jpg";
import earring from "../../../img/jewellery/2.jpg";
import pendant from "../../../img/jewellery/3.jpg";
import bracelets from "../../../img/jewellery/4.jpg";

function JewelleryPage() {
  return (
    <Fragment>
      <Breadcrumbs marks={[{ title: 'Jewellery', path: routing().jewelleryFeed }]} />
      <div className="catalog-block container">
        {/*<img src={banner} alt=""/>*/}
        <Link to={routing().earringFeed}>
          <img src={earring} alt=""/>
        </Link>
        <Link to={routing().pendantFeed}>
          <img src={pendant} alt=""/>
        </Link>
        <Link to={routing().braceletsFeed}>
          <img src={bracelets} alt=""/>
        </Link>
      </div>
      <YourOrderIncludesBlock />
      <SubscribeContainer Component={SubscribeBlock} />
      <SocialBlock />
    </Fragment>
  );
}

export default JewelleryPage;
