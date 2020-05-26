import React, { Fragment } from "react";
import { withRouter } from 'react-router-dom';
import { flowRight as compose } from "lodash";
import Breadcrumbs from "../../_common/Breadcrumbs/Breadcrumbs";
import routing from "../../../config/routing";
import ProductFeedWrapper from "../Shared/ProductFeedWrapper";
import FilterPanelContainer from "./Filters/FilterPanelContainer";
import CatalogFeedListContainer from "./List/CatalogFeedListContainer";
import EngagementSpotlightSlider from "./Items/SpotlightSlider";
import { deviceSelector } from "../../_selectors/deviceSelector";
import { connect } from "react-redux";
import ShapesBlockContainer from "../../_common/ShapesBlock/ShapesBlockContainer";
import OnlineHelpBlock from "../../_common/OnlineHelpBlock/OnlineHelpBlock";
import EngagementShoppingEasy from "./Items/CatalogShoppingEasy";
import SubscribeContainer from "../../_common/Subscribe/SubscribeContainer";
import SubscribeBlock from "../../_common/SubscribeBlock/SubscribeBlock";
import SocialBlock from "../../_common/SocialBlock/SocialBlock";
import CompareAndFavoriteBarContainer from "../../_common/CompareAndFavorites/CompareAndFavoriteBarContainer";
import MetaTags from "../../_common/SEO/MetaTags";
import { fetchMetaTags } from "../../_common/SEO/SeoActions";
import SeoTextBlock from "../../_common/SEO/SeoTextBlock";
import createMetaSlug from "../../../utils/createMetaSlug";
import { metaTagsSelector } from "../../_selectors/metaTagsSelectors";
import toPascalCase from '../../../utils/toPascalCase';
import { fetchCatalogFeed } from "./CatalogFeedActions";
import { filterCategories } from "../../_selectors/catalogFeedSelectors";

class CatalogFeedPage extends React.Component {
  constructor(props) {
    super(props);

    this.sidebar = React.createRef();
    this.wrapper = React.createRef();
    this.headerOffset = 107;

    this.state = {
      showMobileFilters: false
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.scrollHandler);

    const { match, fetchCatalogFeed } = this.props;
    // const catalog = match.params.catalog;
    //
    // fetchCatalogFeed(catalog);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { match, fetchCatalogFeed } = this.props;
    const catalog = match.params.catalog;

    // this.scrollHandler();
    // fetchCatalogFeed(catalog);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollHandler);
  }

  scrollHandler = () => {
    const { isMobile } = this.props;
    const sidebar = this.sidebar.current;
    const wrapper = this.wrapper.current;

    if (isMobile) {
      sidebar.style.position = "";
      sidebar.style.height = "";
      sidebar.style.top = "";
      sidebar.style.display = "";
      return;
    }

    wrapper.style.minHeight = `${window.innerHeight}px`;

    const wrapperRect = wrapper.getBoundingClientRect();
    const viewport = window.innerHeight; //viewport height
    const scroll = window.pageYOffset || document.documentElement.scrollTop; //scroll height
    const topOffset = wrapperRect.top + scroll - this.headerOffset; //top offset of wrapper (distance from top to block)

    if (scroll > topOffset) {
      //if top position of the sidebar less than top viewport position
      sidebar.style.position = "fixed";
      sidebar.style.top = `${this.headerOffset}px`;

      if (viewport > wrapperRect.bottom) {
        //if viewport bottom position greater than wrapper bottom position
        if (wrapperRect.bottom > 0) {
          //if value less than null
          sidebar.style.height = `${wrapperRect.bottom - this.headerOffset}px`;
          sidebar.style.display = "block";
        } else {
          sidebar.style.height = `0px`;
          sidebar.style.display = "none";
        }
      } else {
        //if viewport bottom position is less than wrapper bottom position
        sidebar.style.height = `${viewport - this.headerOffset}px`;
      }
    } else {
      //if top position of the sidebar is greater than top viewport position
      sidebar.style.position = "static";
      sidebar.style.height = `${viewport - (topOffset - scroll) - this.headerOffset}px`;
    }
  };

  handleMobileModal = () => {
    this.setState(prevState => ({
      showMobileFilters: !prevState.showMobileFilters
    }));
  };

  render() {
    const { showMobileFilters } = this.state;
    const { isMobile, match, meta, metaSlug, filterCategories } = this.props;

    const catalogType = match.params.catalog || '';

    let marks = [
      { title: 'Jewellery', path: '/jewellery' },
      { title: catalogType.charAt(0).toUpperCase() + catalogType.slice(1), path: routing().catalogFeed }
      ];

    // if (match.path === routing().engagementFeedWithFilter) {
    //   marks = [
    //     ...marks,
    //     {
    //       // title: get(meta, 'h1', match.params.filter),
    //       title: toPascalCase(match.params.filter),
    //       path: routing(match.params.filter).engagementFeedWithFilter
    //     }
    //   ];
    // }

    return (
      <Fragment>
        <MetaTags page={catalogType} />
        <Breadcrumbs marks={marks} />
        {/*<ConstructorSteps marks={RingConstructor.generateSteps("engagement")} />*/}
        <ProductFeedWrapper>
          <FilterPanelContainer
            handleModal={this.handleMobileModal}
            showMobileFilters={showMobileFilters}
            forwardRef={this.sidebar}
            catalogType={catalogType}
            filterCategories={filterCategories}
          />
          <CatalogFeedListContainer
            handleModal={this.handleMobileModal}
            forwardRef={this.wrapper}
            metaSlug={metaSlug}
            catalogType={catalogType}
          />
        </ProductFeedWrapper>

        <CompareAndFavoriteBarContainer type="engagement" />

        {/*{!isMobile && <EngagementSpotlightSlider />}*/}

        <ShapesBlockContainer
          title="Choose an Engagement Ring with GIA certified Diamond"
          page="feed"
        />
        <EngagementShoppingEasy />
        <OnlineHelpBlock />
        <SubscribeContainer Component={SubscribeBlock} />
        <SocialBlock />
        <SeoTextBlock page={metaSlug} />
      </Fragment>
    );
  }
}

const mapStateToProps = (state, props) => {
  const metaSlug = createMetaSlug("catalog", props.match.params.filter);

  return {
    ...props,
    metaSlug: metaSlug,
    meta: metaTagsSelector(state, metaSlug),
    isMobile: deviceSelector(state),
    filterCategories: filterCategories(state)
  };
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    { fetchMetaTags, fetchCatalogFeed }
  )
)(CatalogFeedPage);
