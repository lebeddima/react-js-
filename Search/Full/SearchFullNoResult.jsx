import React, { Fragment } from "react";
import { Link } from "react-router-dom";

import search1 from "../../../img/search_cat1.jpg";
import search2 from "../../../img/search_cat2.jpg";
import search3 from "../../../img/search_cat3.jpg";
import search4 from "../../../img/search_cat4.jpg";
import routing from "../../../config/routing";

export default class SearchFullNoResult extends React.Component {
  render() {
    return (
      <Fragment>
        <div className="not-found-title">
          <p className="section-title section-title--type2">
            Try the best products we offer
          </p>
        </div>

        <div className="row search-category-row">
          <div className="col-md-6">
            <Link to={routing().diamondsFeed}>
              <div className="search-category">
                <img src={search1} alt="" />
                <p className="search-category__title">Diamonds</p>
                <div className="form-label search-category__labels">
                  <Link to={routing("Round").diamondsFeedWithShape}>
                    <button className="form-label__item ">Round</button>
                  </Link>
                  <button className="form-label__item ">Guide</button>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-6">
            <Link to={routing().engagementFeed}>
              <div className="search-category">
                <img src={search2} alt="" />
                <p className="search-category__title">Engagement rings</p>
                <div className="form-label search-category__labels">
                  <button className="form-label__item ">With diamond</button>
                  <button className="form-label__item ">Guide</button>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-6">
            <Link to={routing().weddingFeed}>
              <div className="search-category">
                <img src={search3} alt="" />
                <p className="search-category__title">
                  Wedding and anniversary gifts
                </p>
                <div className="form-label search-category__labels">
                  <Link to={routing("mens").weddingFeedWithFilter}>
                    <button className="form-label__item ">For him</button>
                  </Link>
                  <Link to={routing("womens").weddingFeedWithFilter}>
                    <button className="form-label__item ">For her</button>
                  </Link>
                  <button className="form-label__item ">Guide</button>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-6">
            <div className="search-category">
              <img src={search4} alt="" />
              <p className="search-category__title">Jewellery</p>
              <div className="form-label search-category__labels">
                <button className="form-label__item ">Pendants</button>
                <button className="form-label__item ">Necklaces</button>
                <button className="form-label__item ">Guide</button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
