import React, { Fragment } from "react";
import Breadcrumbs from "../../_common/Breadcrumbs/Breadcrumbs";
import routing from "../../../config/routing";
import SearchFullInput from "./SearchFullInput";
import SearchFullResults from "./SearchFullResults";

export default class SearchFullPage extends React.Component {
  render() {
    return (
      <Fragment>
        <Breadcrumbs marks={[{ title: "Search", path: routing().search }]} />
        <section className="search-section">
          <div className="container">
            <SearchFullInput />
            <SearchFullResults />
          </div>
        </section>
      </Fragment>
    );
  }
}
