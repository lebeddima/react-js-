import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { getShopsList } from 'store/thunks/shops';
import { getLangId, parseStr } from "components/utils/helpers";

function useCacheShops(data = null, key = null) {
  const dispatch = useDispatch();
  const {shops, isLoaded: isLoadedShops, error: errorShops} = useSelector(state => state.shops);
  const { mallId } = useParams();
  const langId = getLangId();
  const [responseShops, setResponseShops] = useState(null);

  useEffect(() => {
    if(!shops.length){
      dispatch(getShopsList(mallId, langId))
    }
  }, [mallId, langId, data, key])

  useEffect(() => {
    if (shops) {
      let filteringShopsByCategory;
      
      if (data) {
        switch (key) {
          case 'category_name':
            filteringShopsByCategory = shops.filter(shop => parseStr(shop[key]) === data);
            setResponseShops(filteringShopsByCategory);
            break;
          case 'category_tags':
            filteringShopsByCategory = shops.filter(shop => parseStr(shop[key]).includes(data));
            setResponseShops(filteringShopsByCategory);
            break;
          case 'id':
            filteringShopsByCategory = shops.filter(shop => shop[key] === data);
            setResponseShops(filteringShopsByCategory);
            break;
          default:
            return [];
        }
      } else {
        setResponseShops(shops)
      }
    }
  }, [shops, setResponseShops, mallId, key, data]);

  return { responseShops,  isLoadedShops, errorShops };
}

export default useCacheShops;
