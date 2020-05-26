import React, { useEffect } from 'react';

import useFetch from 'components/hooks/useFetch';
import useLocation from "components/hooks/useLocation";
import useCacheCategories from "components/hooks/useCacheCategories";
import SubHeader from "components/shared/layout/header/sub-header";
import Header from "components/shared/layout/header/index";
import CategoriesList from "components/shared/layout/lists/mall-categories";
import StocksList from "components/shared/layout/lists/stocks";
import { types } from "components/shared/layout/header/views";
import TagList from "components/shared/layout/lists/tag-list";

function HomePage(props) {
  const { mallId } = props.match.params;
  const [{ response, error, isLoading }, doFetch] = useFetch('get-stock');
  const yourLocation = useLocation();
    const [
        {response: responseCategories, error: errorCategories, isLoading: isLoadingCategories},
        doFetchCategories
    ] = useFetch(`get-categories/${mallId}`);

    useEffect(() => {
        doFetchCategories()
    }, [doFetchCategories]);

      useEffect(() => {
        doFetch()
      }, [doFetch]);

    useEffect(() => {
      if(localStorage.getItem('from_loc') && localStorage.getItem('to_loc') && !localStorage.getItem('qrReader')){
        localStorage.removeItem('your_location');
        localStorage.removeItem('from_loc');
        localStorage.removeItem('to_loc');
        localStorage.removeItem('to_loc_moduleId');
      } else {
        localStorage.removeItem('to_loc');
        localStorage.removeItem('to_loc_moduleId');
      }
    }, [])

  return (
    <div className="page">
      <Header />
      
      <div className="sub-header container">
        <h2 className="small-h2">Вирушай до шопiнгу!</h2>
        <SubHeader
          type={types.HOME}
          id={yourLocation}
        />
      </div>
      
      <section className="main container">
        <CategoriesList
          data={responseCategories}
          error={errorCategories}
          isLoading={isLoadingCategories} />
        <StocksList
          h1="Найцiкавiшi акцiї"
          mallId={mallId}
          data={response}
          isLoading={isLoading}
          error={error}
          showBtn={true}
        />
      </section>
    </div>
  )
}

export default HomePage;
