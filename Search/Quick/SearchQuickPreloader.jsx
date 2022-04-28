import React from "react";
import { PreloaderImg } from "../../_common/Preloader";

const SearchQuickPreloader = () => (
  <div className="search-preview">
    <div className="row">
      <div className="col justify-content-center d-flex">
        <PreloaderImg height="77px" margin="10px auto" />
      </div>
    </div>
  </div>
);

export default SearchQuickPreloader;
