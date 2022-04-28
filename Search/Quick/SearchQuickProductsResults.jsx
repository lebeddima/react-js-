import React from "react";
import SearchQuickResultsWrapper from "./SearchQuickResultsWrapper";
import { Link } from "react-router-dom";
import routing from "../../../config/routing";
import ImageLoader from "../../_common/ImageLoader";
import localeStore from "../../../config/LocalesStore";
import FavoriteButton from "../../_common/Buttons/FavoriteButton";
import CompareButton from "../../_common/Buttons/CompareButton";
import GoogleEE from '../../_common/GoogleEE/GoogleEE';

function handleLogClick({ product, position = 1 }) {
  GoogleEE.productClick({
    product: product,
    list: GoogleEE.LIST_SEARCH,
    position: position
  })
}

const ProductItem = ({ item, position }) => {
  const {
    title,
    subtitle,
    slug,
    id,
    h1,
    preview_image,
    price,
    product_type,
  } = item;

  let type, link;
  switch (product_type) {
    case "diamonds":
      type = "diamond";
      link = routing({ slug, id }).diamondProduct;
      break;
    case "engagement-rings":
      type = "engagement";
      link = routing({ slug: h1, id }).engagementProduct;
      break;
    case "wedding-rings":
      type = "wedding";
      link = routing({ slug: h1, id }).weddingProduct;
      break;
    case "products":
      type = item.category.slug.includes('s') ? item.category.slug.slice(0, item.category.slug.length - 1) : item.category.slug;;
      link = routing({ slug: h1, id }).catalogProduct;
      break;
    default: console.log("Error in ProductItem")
  }

  return (
      <div className="col-12 col-md-6" onClick={() => handleLogClick({ product: item, position})}>
        <div className=" slide slide--full  slide--row  slide--search-preview ">
          <div className="slide__img">
            <Link to={link}>
              <ImageLoader
                  product={item}
                  list={GoogleEE.LIST_SEARCH}
                  position={position}
                  src={preview_image ? preview_image.path.medium : ""}
              />
            </Link>
          </div>
          <div className="slide-info ">
            <div className="row">
              <div className="col-7 ">
                <p className="slide__name">{title}</p>
                <span className="ring-options ">{subtitle}</span>
                <div className="slide-action slide-action--start ">
                  <FavoriteButton
                      type={type}
                      data={item}
                      className="prod-action prod-action--type2"
                  />
                  <CompareButton
                      type={type}
                      data={item}
                      className="prod-action "
                  />
                </div>
              </div>
              <div className="col-5 ">
                <p className="table-price table-price--center ">
                  {localeStore.formatPrice(price ? price.count : 0)}
                  <span>{localeStore.taxString}</span>
                </p>
                {price.old_count && (
                    <p className="table-price table-price--center table-price--type2">
                      {localeStore.formatPrice(price.old_count ? price.old_count : 0)}
                    </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

const SearchQuickProductsResults = ({ data }) => {
  const items = data ? data.map((item, index ) => (
      <ProductItem item={item} key={`search_${item.sku}`} position={index + 1} />
  )) : [];
  return (
      <SearchQuickResultsWrapper title="Featured products">
        <div className="search-preview">
          <div className="row">{items}</div>
        </div>
      </SearchQuickResultsWrapper>
  );
};

export default SearchQuickProductsResults;
