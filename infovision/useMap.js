import { useEffect, useState, useContext } from "react";
import axios from "axios";

import config from 'components/config';
import { getMallId, getLangId, isEmptyObjectOrFalse } from "components/utils/helpers";
import MapConstructor from "components/pages/map/mapConstructor";
import { LavinaContext } from "components/context";
import useFetch from "components/hooks/useFetch";

function useMap() {
  const mallId = getMallId();
  const langId = getLangId();

  const [state] = useContext(LavinaContext);
  const [shopId, setShopId] = useState(null);
  const [JSONData, setJSONData] = useState(null);
  const [responseJSON, setResponseJSON] = useState(null);
  const [isAllowRender, setIsAllowRender] = useState(false);
  const [{ response }, doFetch] = useFetch(`${mallId}/${langId}/get-shop-id-v2`);

  useEffect(() => doFetch(), []);
  useEffect(() => {
    const lavinaLocationsState = !isEmptyObjectOrFalse(state) ? state : null;
    
    setInterval(() => {
      // console.log('qwe123 wed', lavinaLocationsState);
      if (lavinaLocationsState) {
        const firstKey = Object.keys(lavinaLocationsState)[Object.keys(lavinaLocationsState).length - 1];
        const yourLocationFromLS = localStorage.getItem('your_location');

        if (yourLocationFromLS && lavinaLocationsState) {
          const shopId = Object.keys(lavinaLocationsState)
              .filter(shopId => `?location=terminal${lavinaLocationsState[shopId]}` === yourLocationFromLS);

          if (shopId.length) {
            setShopId(...shopId);
          } else {
            setShopId(firstKey);
          }
        } else {
          setShopId(firstKey)
        }
      }
    }, 2000)
  }, [state]);
  
  useEffect(() => {
    if (shopId) {
      const requestOptions = {headers: {
          'Content-type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }};

      axios(`${config.BASE_URL}${mallId}/${shopId}/${langId}/get-data`, requestOptions)
          .then(response => {
            setResponseJSON(response.data);
          })
          .catch(error => {
            console.log('map fetch error', error)
          });
    }
  }, [shopId]);
  
  useEffect(() => {
    if (responseJSON) {
      setJSONData(responseJSON)
    }
  }, [responseJSON, setJSONData]);
  
  useEffect(() => {
    if (JSONData) {
      console.log('JSONData', JSONData);
      const mapCreator = new MapConstructor(JSONData);
      mapCreator.loadJSON();
      mapCreator.actionsClick();
      setIsAllowRender(true);
    }
  }, [JSONData]);
  
  return isAllowRender
}

export default useMap;
