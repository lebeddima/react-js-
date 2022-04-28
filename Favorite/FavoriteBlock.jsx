import React from "react";
import { connect } from "react-redux";
import selectors from "../_selectors/favoriteSelectors";
import CategoryTabsContainer from "./Items/CategoryTabsContainer";
import ActionsBlockContainer from "./Items/ActionsBlockContainer";
import FavoriteList from "./Items/FavoriteList";
import routing from "../../config/routing";

class FavoriteBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: props.matchParams.tab ? props.matchParams.tab : "diamond",
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.matchParams.tab !== this.props.matchParams.tab ) {
      this.setState({
        currentTab: this.props.matchParams.tab
          ? this.props.matchParams.tab
          : "diamond",
      });
    }
  }

  handleChangeTab = (tab) => {

    if (this.state.currentTab !== tab) {
      this.setState(
        {
          currentTab: tab,
        },
        () => {
            this.props.history.push(routing(tab).favoriteTab);
        }
      );
    }
  };

  render() {
    const { currentTab } = this.state;
    return (
      <section className="fav-and-compare-section">
        <div className="container">
          <p className="section-title section-title--type2">Favourites</p>
          <CategoryTabsContainer
            currentTab={currentTab}
            handleChange={this.handleChangeTab}
          />
          <div className="row fav-compare-row">
            <div className="col-md-4 col-lg-3 xs-hide">
              <ActionsBlockContainer currentTab={currentTab} />
            </div>
            <div className="col-md-8 col-lg-9">
              <FavoriteList currentTab={currentTab}
              />
            </div>
            <div className="col-12 xs-show">
              <ActionsBlockContainer currentTab={currentTab} isMobile={true} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  data: selectors.data(state),
});

export default connect(
    mapStateToProps,
    null
)(FavoriteBlock);

