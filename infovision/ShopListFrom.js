import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SubHeader from "components/shared/layout/header/sub-header";
import Header from "components/shared/layout/header/index";
import Builds from "components/shared/layout/lists/builds";
import { types } from "components/shared/layout/header/views";
// import useCacheShops from "components/hooks/useCacheShops";
import TagList from "components/shared/layout/lists/tag-list";
import useCacheCategories from "components/hooks/useCacheCategories";
import { getShopsList } from "store/thunks/shops";
import {getLangId, getMallId} from "components/utils/helpers";

function ShopListFrom(props) {
  // const { categoryName } = props.match.params;
  const mallId = getMallId();
  const langId = getLangId() || 30;
  const { responseCategories, errorCategories, isLoadingCategories } = useCacheCategories(mallId);

  const dispatch = useDispatch();
  const {shops: responseShops, isLoaded: isLoadedShops, error: errorShops} = useSelector(state => state.shops);

  useEffect(() => {
    if(!responseShops.length){
      dispatch(getShopsList(mallId, langId));
    }
  }, [mallId, langId])

  const title = 'Обери локацію поруч з тобою';


  return (
    <div className="page">
      <Header />
      <div className="sub-header container">
        <h2>{title}</h2>
        <SubHeader
          type={types.OTHER}
          mallId={mallId}
          taglist={
            <TagList
              data={responseCategories && responseCategories.slice(0, 5)}
              isLoading={isLoadingCategories}
              error={errorCategories}
            />
          }
        />
      </div>

      <section className="main container">
        <Builds
          data={responseShops}
          isLoading={!isLoadedShops}
          error={errorShops}
          mallId={mallId}
          type="shop-listFrom"
        />
      </section>
    </div>
  )
}

export default ShopListFrom;
