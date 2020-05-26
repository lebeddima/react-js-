import React, { Fragment } from "react";
import HeaderSearchSvg from "../../../img/jsSvg/HeaderSearchSvg";
import SearchQuickModal from "./SearchQuickModal";

export default class SearchHeaderButton extends React.Component {
  state = {
    isSearchModalOpen: false
  };

  handleModal = () => {
    this.setState({
      isSearchModalOpen: !this.state.isSearchModalOpen
    });
  };

  render() {
    const { isSearchModalOpen } = this.state;
    return (
      <Fragment>
        <div className="header-search">
          <span className="header-search__icon" onClick={this.handleModal}>
            <HeaderSearchSvg />
          </span>
          <input
            type="text"
            className="header-search__field"
            placeholder="Heart shape diamonds"
            onFocus={this.handleModal}
            autoComplete="off"
          />
        </div>

        {isSearchModalOpen && (
          <SearchQuickModal handleModal={this.handleModal} />
        )}
      </Fragment>
    );
  }
}
