import React, { Fragment, memo } from 'react';

import useLocation from "components/hooks/useLocation";
import useCacheStocks from 'components/hooks/useCacheStocks';
import useCacheShops from "components/hooks/useCacheShops";
import Header from "components/shared/layout/header";
import SubHeader from "components/shared/layout/header/sub-header";
import StocksList from "components/shared/layout/lists/stocks";
import { types } from "components/shared/layout/header/views";
import Error from "components/shared/layout/error";
import Preloader from "components/shared/layout/preloader";
import { getBackgroundColor } from "components/utils/helpers";

function ShopPage(props) {
  const { shopId, mallId } = props.match.params;

  const yourLocation = useLocation();
  const { responseShops, isLoadedShops, errorShops } = useCacheShops(parseInt(shopId), 'id');
  const [sortedStocks, errorStockData, isLoadingStockData] = useCacheStocks(parseInt(shopId), 'location_id');

  if (!isLoadedShops) return <Preloader fullsize={true} />;

  console.log(responseShops, "aaa")
  
  return (
    <div className="page page--screen" id="screen-location-detail">
      <div id="open-list-magazines">
        <div className="click-back-btn" data-screen-to-switch="screen-location-detail" />
      </div>
      {responseShops && responseShops.length && (
        <Fragment>
          <div
            id="block-location-detail"
            data-lvl={`${
              responseShops[0].name === 'Сушiя' ||
              responseShops[0].name === 'Чачасала'
                ? "2-floor"
                : "1-floor"}`}
            data-build={responseShops[0].location_build_num}
            data-title={responseShops[0].name}
            data-loc={responseShops[0].id_module}
            data-separation={false}
            data-isparking={false}
          />
          <Header
            logo={responseShops[0].icon_path}
            shop={responseShops[0]} />
          
          <div className="sub-header container" style={getBackgroundColor(responseShops[0]).background}>
            <h2>{responseShops[0].name}</h2>
            <SubHeader
              type={types.SHOP}
              id={yourLocation}
              shop={responseShops[0]}
              isShopPage
              link="#"
              title="10:00 - 22:00"
              description={responseShops[0].description_ua} />
          </div>
  
          <section className="main container">
            {sortedStocks && (
              <Fragment>
                <StocksList
                  h1="АКЦІЇ МАГАЗИНУ"
                  mallId={mallId}
                  data={sortedStocks}
                  isLoading={isLoadingStockData}
                  error={errorStockData} />
                <SubHeader
                  type={types.SHOP}
                  id={yourLocation}
                  shop={responseShops[0]}
                  isShopPage={true}
                  isBottomPanel={true} />
              </Fragment>
            )}
          </section>
        </Fragment>
      )}
      {errorShops && <Error error={errorShops} />}
    </div>
  )
}

export default memo(ShopPage);
