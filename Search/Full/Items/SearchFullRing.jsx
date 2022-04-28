import React, { Fragment } from "react";
import './style.css';
import ImageLoader from "../../../_common/ImageLoader";
import CompareButton from "../../../_common/Buttons/CompareButton";
import FavoriteButton from "../../../_common/Buttons/FavoriteButton";
import localeStore from "../../../../config/LocalesStore";
import routing from "../../../../config/routing";
import { Link } from "react-router-dom";

import GoogleEE from '../../../_common/GoogleEE/GoogleEE';

const SearchFullRing = ({type, isMobile, position, data: {preview_image, subtitle, title, price, h1, id }, data}) => {

  const handleLogClick = () => {

    GoogleEE.productClick({
      product: data,
      list: GoogleEE.LIST_SEARCH,
      position: position
    })
  }

    const link =
      type === "engagement"
        ? routing({ slug: h1, id }).engagementProduct
        : routing({ slug: h1, id }).weddingProduct;

    return (
      <div className="col-12 col-md-6 col-lg-3" onClick={handleLogClick}>
        <div className=" slide slide--full slide--full slide--xs-row  slide--search-result ">
          <div className="slide__img">
            <Link to={link}>
              <ImageLoader
                product={data}
                list={GoogleEE.LIST_SEARCH}
                position={position}
                src={preview_image ? preview_image.path.medium : ""}
              />
            </Link>
          </div>
          <div className="slide-info ">
            <div className="row">
              <div className="col-7 col-md-12">
                {!isMobile && (
                  <Fragment>
                    <span className="ring-options">{subtitle}</span>
                    <p className="slide__name">{title}</p>
                  </Fragment>
                )}

                {isMobile && (
                  <Fragment>
                    <p className="slide__name">{title}</p>
                    <span className="ring-options">{subtitle}</span>
                  </Fragment>
                )}

                {isMobile && (
                  <div className="slide-action slide-action--xs-start">
                    <CompareButton
                      type={type}
                      data={data}
                      className="prod-action prod-action--type2"
                    />
                    <FavoriteButton
                      type={type}
                      data={data}
                      className="prod-action"
                    />
                  </div>
                )}
              </div>
              <div className="col-5 col-md-12">
                <p className="table-price table-price--type3 table-price--xs-center ">
                  {localeStore.formatPrice(price ? price.count : 0)}
                  <span>{localeStore.taxString.split('.').join('. ')}</span>
                </p>
                {price.old_count && (
                  <p className="table-price table-price--center table-price--type2">
                    {localeStore.formatPrice(price ? price.old_count : 0)}
                  </p>
                )}

                {!isMobile && (
                  <div className="slide-action  xs-hide">
                    <CompareButton
                      type={type}
                      data={data}
                      className="prod-action prod-action--type2"
                    />
                    <FavoriteButton
                      type={type}
                      data={data}
                      className="prod-action"
                    />
                  </div>
                )}

                <div className="table-action">
                  <Link to={link}>
                    <button className="theme-btn table-action__item">
                      View
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default SearchFullRing;
