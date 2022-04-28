import React, { Fragment } from "react";
import FilterShapes from "../../Shared/Filters/FilterShapes";
import closeSvg from "../../../../img/svg/close.svg";
import FilterRangeNumber from "../../Shared/Filters/FilterRangeNumber";
import FilterMetal from "../../Shared/Filters/FilterMetal";
import FilterStyle from "../../Shared/Filters/FilterStyle";
import FilterSizes from "../../Shared/Filters/FilterSizes";
import FilterCheckbox from "../../Shared/Filters/FilterCheckbox";
import localeStore from "../../../../config/LocalesStore";
import RingConstructor from "../../../_common/RingConstructor/RingConstructor";
import { findEngagementFilterByName } from "../../../../utils/findFilterByName";
import { isEqual } from "lodash";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons/faSyncAlt";
import IconFA from '../../../_common/IconFA';
import FilterCategory from "../../Shared/Filters/FilterCategory";

export default class FilterPanel extends React.Component {
  componentDidMount() {
    const { match } = this.props;
    const catalog = match.params.catalog || 'earrings';

    if (this.props.status !== "success") {
      this.props.fetchFilters(catalog);
      this.handleUrlFilters();
      return;
    }

    if (RingConstructor.diamondId) {
      this.props.clearFilters();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { params } = this.props.match;
    if (!isEqual(params, prevProps.match.params)) {
      this.handleUrlFilters();
    }
  }

  handleUrlFilters = () => {
    const { params } = this.props.match;

    // this.props.clearFilters();

    if (params.filter) {
      const { type, slug } = findEngagementFilterByName(params.filter);

      const {
        setCatalogShape,
        setCatalogStyle,
        setCatalogMetal
      } = this.props;

      switch (type) {
        case "style":
          setCatalogStyle(slug);
          break;
        case "metal":
          setCatalogMetal(slug);
          break;
        case "shape":
          if (!RingConstructor.diamondId) {
            setCatalogShape(slug);
          }
          break;
        default:
          return;
      }
    }
  };

  closeModalHandler = ({ target }) => {
    if (!target.closest(".modal-mob__inner")) {
      this.props.handleModal();
    }
  };

  componentWillUnmount() {
    if (RingConstructor.diamondId) {
      this.props.clearFilters();
    }
  }

  render() {
    const {
      forwardRef,
      status,
      input,
      clear,
      toggle,
      showMobileFilters,
      changeSizeTab,
      clearFilters,
      toggleAllMetals,
      saveCatalogShape,
      saveCatalogPrice,
      saveCatalogMetal,
      saveCatalogStyle,
      saveCatalogSize,
      saveCatalogBrands,
      saveCatalogOffers,
      handleModal,
      isMobile,
      catalogType,
      filterCategories,
        match
    } = this.props;
    const {
      metal = [],
      price = {},
      style = [],
      size = [],
      brands = [],
      offers = []
    } = this.props.config;


    const jewelleryCatalog = match.path.split('/')[1];

    return (
      <div className="col-lg-4 col-xl-3">
        <div
          className={`filter-container modal-mob ${
            showMobileFilters ? "active" : ""
          }`}
          onClick={this.closeModalHandler}
        >
          <div className="modal-mob__inner filter-pc-bar" ref={forwardRef}>
            <FilterCategory
              catalogType={catalogType}
              filterCategories={filterCategories}
            />
            {status === "request" || status === "none" ? (
              <Fragment>
                <button className="close-nav sm-show" onClick={handleModal}>
                  <img src={closeSvg} alt="" />
                </button>
                <div className="row">{/*<Preloader withMargin />*/}</div>
              </Fragment>
            ) : (
              <Fragment>
                <button className="close-nav sm-show" onClick={handleModal}>
                  <img src={closeSvg} alt="" />
                </button>
                {/*<div className="modal-header justify-content-between sm-show">*/}
                {/*<div className="">*/}
                {/*/!*<p className="modal-header-title">*!/*/}
                {/*/!*Diamond filters*!/*/}
                {/*/!*</p>*!/*/}
                {/*/!*<span className="modal-subtitle">{`${total} ${total > 1 ? 'diamonds' : 'diamond'} found`}</span>*!/*/}
                {/*</div>*/}
                {/*<button className="filter-apply" onClick={handleModal}>*/}
                {/*Apply*/}
                {/*</button>*/}
                {/*</div>*/}

                <div className="row">
                  <FilterMetal
                    wrapper="product"
                    title="Metal"
                    type="metal"
                    data={metal}
                    input={input.metal}
                    save={saveCatalogMetal}
                    toggle={toggleAllMetals}
                    video={{
                      category: "product",
                      type: "metal"
                    }}
                  />
                  <FilterRangeNumber
                    wrapper="product"
                    title="Price"
                    type="price"
                    sign="price"
                    step={100}
                    accuracy={0}
                    min={Math.floor(price.min)}
                    max={Math.ceil(price.max)}
                    input={input.price}
                    save={saveCatalogPrice}
                    toggle={toggle}
                    logarithm
                    video={{
                      category: "product",
                      type: "price"
                    }}
                  />
                  {
                    jewelleryCatalog !== "jewellery" ?<FilterStyle
                        wrapper="product"
                        title="Style"
                        type="style"
                        data={style}
                        input={input.style}
                        save={saveCatalogStyle}
                        clear={clear}
                        video={{
                          category: "product",
                          type: "style"
                        }}
                        isMobile={isMobile}
                        showMobile={showMobileFilters}
                    /> : null
                  }

                  {/*<FilterShapes*/}
                  {/*<span></span>*/}
                    {/*wrapper="product"*/}
                    {/*title="Diamond Shapes"*/}
                    {/*type="shape"*/}
                    {/*input={input.shape}*/}
                    {/*save={saveCatalogShape}*/}
                    {/*clear={clear}*/}
                    {/*disabled={RingConstructor.diamondId}*/}
                    {/*video={{*/}
                      {/*category: "product",*/}
                      {/*type: "shape"*/}
                    {/*}}*/}
                  {/*/>*/}
                  {/*<FilterSizes*/}
                    {/*wrapper="sizes"*/}
                    {/*title="Size"*/}
                    {/*type="size"*/}
                    {/*data={size}*/}
                    {/*input={input.size}*/}
                    {/*select={saveCatalogSize}*/}
                    {/*changeTab={changeSizeTab}*/}
                    {/*clear={clear}*/}
                    {/*video={{*/}
                      {/*category: "product",*/}
                      {/*type: "size"*/}
                    {/*}}*/}
                  {/*/>*/}
                  {/*{offers.length &&*/}
                    {/*(<FilterCheckbox*/}
                        {/*wrapper="product"*/}
                        {/*title="Offers"*/}
                        {/*type="offers"*/}
                        {/*data={offers}*/}
                        {/*input={input.offers}*/}
                        {/*save={saveCatalogOffers}*/}
                        {/*clear={clear}*/}
                        {/*video={{*/}
                          {/*category: "product",*/}
                          {/*type: "offer"*/}
                        {/*}}*/}
                      {/*/>)*/}
                  {/*}*/}
                  {/*<FilterCheckbox*/}
                    {/*wrapper="product"*/}
                    {/*title="Brands"*/}
                    {/*type="brands"*/}
                    {/*data={brands}*/}
                    {/*input={input.brands}*/}
                    {/*save={saveCatalogBrands}*/}
                    {/*clear={clear}*/}
                    {/*video={{*/}
                      {/*category: "product",*/}
                      {/*type: "brand"*/}
                    {/*}}*/}
                  {/*/>*/}
                </div>
                <div className="col-12 filter-full-btn">
                  <div className="more-filter">
                    <button
                      className="more-filter__btn more-filter__btn--type2"
                      onClick={() => clearFilters()}
                    >
                      <span>
                        <IconFA icon={faSyncAlt}/>
                      </span>
                      Clear all
                    </button>
                  </div>
                </div>
                <div className="col-12 sm-show filter-full-btn">
                  <div className="apply">
                    <button
                      className="theme-btn theme-btn--type2  theme-btn--full-width"
                      onClick={handleModal}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}
