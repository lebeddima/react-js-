import React, {useEffect, useState} from "react";
import { withRouter } from 'react-router-dom';
import useGetShopId from "components/hooks/useGetShopId";
import closeSvg from "assets/img/map/exit-icon.svg";
import burgerSvg from "assets/img/map/burger.svg";
import markerBlueSvg from "assets/img/map/marker-blue.svg";
import {getLangId, getMallId, getFromLoc, getToLoc, getToLocModuleId} from "components/utils/helpers";
import axios from "axios";
import config from "components/config";
import MapConstructor from "components/pages/map/mapConstructor";
import useFetch from "components/hooks/useFetch";

function Map(props) {
  const shopIds = useGetShopId();
  const mallId = getMallId();
  const langId = getLangId();
  const fromLoc = getFromLoc();
  const toLoc = getToLoc();
  const toLocModuleId = getToLocModuleId();
  const [shopIdFrom, setShopIdFrom] = useState(null);
  const [shopIdTo, setShopIdTo] = useState(null);

  const [JSONData, setJSONData] = useState(null);
  const [responseJSON, setResponseJSON] = useState(null);
  const [{ response }, doFetch] = useFetch(`${mallId}/${langId}/get-shop-id-v2`);


  useEffect(() => {
    doFetch()
    setShopIdFrom(+fromLoc);
    setShopIdTo(+toLoc);
  } , []);

  useEffect(() => {
    if (shopIdFrom) {
      const requestOptions = {headers: {
          'Content-type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }};

      axios(`${config.BASE_URL}${mallId}/${shopIdFrom}/${langId}/get-data`, requestOptions)
          .then(response => {
            setResponseJSON(response.data);
          })
          .catch(error => {
            alert('/get-data dont have your location')
            console.log('map fetch error', error)
          });
    }
  }, [shopIdFrom]);

  useEffect(() => {
    if (responseJSON) {
      setJSONData(responseJSON)
    }
  }, [responseJSON, setJSONData]);

  useEffect(() => {
    if (JSONData) {
      let toLocation = {};
      JSONData.levels.forEach(build => {
        build.forEach(floor => floor.locations.forEach(loc => {
          if(loc.id === toLocModuleId){
          toLocation = {...loc};
          }
        }))
      })
      if(Object.keys(toLocation).length){
        const mapCreator = new MapConstructor(JSONData, toLocation);
        mapCreator.loadJSON();
        mapCreator.actionsClick();
      }
    }
  }, [JSONData, toLocModuleId]);

  useEffect(() => {
    if (shopIds) {
      setTimeout(() => {
        const svgPaths = document.querySelectorAll('path[id_terminal_shopname]');
        for (let key of svgPaths) {
          key.setAttribute('data-shop-id', shopIds[key.getAttribute('id')] || 0);
        }
        // setComplete(true);
      }, 3000)
    }
  }, [shopIds]);


  return (
    <div >

      <div id="svg-map" />
      <div id="floor-block">
        <div className="btn-block" id="hide-floors">
          <div className="btn-circle">
            <img src={closeSvg} alt="" />
          </div>
        </div>
        <ul id="floors-list">
          <div className="map-controls-inner">
            <div className="map-controls-floors">
              <div className="levels"></div>
            </div>
          </div>
        </ul>
      </div>
      <div className="map-controls">
        <div className="floor-menu min" id="floors">
          <div className="floor-menu__btn">
            <div id="floors-text" className="floor-menu__btn-text floolevel-selectr_text">
              <span className="floor-num">1</span>
              <img className="floor-img" src={burgerSvg} alt="" />
            </div>
          </div>
        </div>
        <div className="where-am-i" style={{}}>
          <img className="where-am-i-img" src={markerBlueSvg} alt="" />
        </div>

      </div>

      <div className="popup-btn-wrap" style={{display: 'none', visibility: 'hidden', opacity: '0' }}>
        <div className="popup-path">
        </div>
      </div>
    </div>
    )
}

export default withRouter(Map);
