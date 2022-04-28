import React from "react";
import CloseSvg from "../../../img/jsSvg/CloseSvg";
import EyeSvg from "../../../img/jsSvg/EyeSvg";
import { Link } from "react-router-dom";

import localeStore from "../../../config/LocalesStore";
import routing from "../../../config/routing";
import ImageLoader from "../../_common/ImageLoader";
import CompareButton from "../../_common/Buttons/CompareButton";
import ConstructorFavoriteButton from "../../_common/RingConstructor/ConstructorFavCompareButton";
import GoogleEE from '../../_common/GoogleEE/GoogleEE';
import capitalizeString from '../../../utils/capitalizeString';

function handleLogClick({ product, position = 1 }) {
  GoogleEE.productClick({
    product: product,
    list: GoogleEE.LIST_FAVORITE,
    position: position
  })
}

const DiamondFavItem = ({ data, removeAction, currentTab, position }) => {
  const { id, slug, title, subtitle, price = {}, preview_image = {} } = data;
  const { shape = {} } = data.options;
  return (
    <div className="col-12 col-md-6 col-lg-4 fav-col" onClick={() => handleLogClick({ product: data, position})}>
      <div className=" slide slide--full listing listing--fav slide--xs-row">
        {/*<div className="category-block category-block--type2">*/}
        {/*<button className="category active">*/}
        {/*Get a GIFT with diamond*/}
        {/*</button>*/}
        {/*</div>*/}
        {removeAction && (
          <button
            className="listing-control "
            onClick={() => removeAction(data)}
          >
            <CloseSvg width="17" height="17" />
          </button>
        )}

        <div className="slide__img">
          <Link to={routing({ slug, id }).diamondProduct}>
            <ImageLoader
              product={data}
              list={GoogleEE.LIST_FAVORITE}
              position={position}
              src={preview_image ? preview_image.path.medium : ""}
              preloadStyles={{ height: "125px", margin: "50px auto" }}
            />
          </Link>
        </div>
        <div className="slide-info">
          <span className="slide__title">{title}</span>
          <p className="slide__name">{subtitle}</p>
          <p className="table-price table-price--type3">
            {localeStore.formatPrice(price ? price.count : 0)}
            <span>{localeStore.taxString.split('.').join('. ')}</span>
          </p>
          <p className="table-price table-price--type2">
            {price.old_count && localeStore.formatPrice(price.old_count)}
          </p>
          <ConstructorFavoriteButton
            type="diamond"
            id={id}
            className="slide__btns xs-hide"
          />
          <Link
            to={routing(shape ? capitalizeString(shape.slug) : "Round").diamondsFeedWithShape}
            className="slide__more xs-hide"
          >
            More like this
          </Link>
          <div className="slide-action xs-hide">
            <CompareButton
              data={data}
              type={currentTab}
              className="prod-action prod-action--type2"
            />

            <button className="prod-action x">
              <Link to={routing({ slug, id }).diamondProduct}>
                <span className="extra-icon ">
                  <EyeSvg />
                </span>
              </Link>
            </button>
          </div>
        </div>
      </div>

      <ConstructorFavoriteButton
        type="diamond"
        id={id}
        className="fav-panel xs-show"
      >
        <Link
          to={routing(shape ? capitalizeString(shape.slug) : "Round").diamondsFeedWithShape}
          className="theme-btn theme-btn--type3"
        >
          More like this
        </Link>
        <CompareButton
          data={data}
          type={currentTab}
          className="fav-panel__item"
        />
      </ConstructorFavoriteButton>
    </div>
  );
};

export default DiamondFavItem;
