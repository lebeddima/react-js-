import React from "react";
import HeaderSearchSvg from "../../../img/jsSvg/HeaderSearchSvg";
import { PreloaderImg } from "../../_common/Preloader";
import routing from "../../../config/routing";

export default class SearchQuickInput extends React.Component {
  constructor(props) {
    super(props);

    this.input = React.createRef();
  }

  componentDidMount() {
    this.input.current.focus();
  }

  handleChange = ({ currentTarget }) => {
    const value = currentTarget.value;

    if (!value.length) {
      this.props.clear();
    }

    if (value.length >= 3) {
      this.props.search(value);
    }
  };

  handleKeyPress = event => {
    if (event.key === "Enter") {
      const { haveResults, status, push, query } = this.props;

      if (haveResults && status === "success") {
        push(routing(query).search);
      }
    }
  };

  render() {
    const { status } = this.props;
    return (
      <div className="header-search header-search--type2">
        <span className="header-search__icon">
          {status === "request" ? (
            <PreloaderImg height="18px" margin="2px auto" />
          ) : (
            <HeaderSearchSvg />
          )}
        </span>
        <input
          ref={this.input}
          type="text"
          placeholder="Search..."
          className="header-search__field"
          onKeyPress={this.handleKeyPress}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
