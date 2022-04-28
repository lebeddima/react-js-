import React from "react";
import routing from "../../../config/routing";
import FavoriteShareList from "./FavoriteShareList";
import api from "../../../config/api";
import notification from "../../../utils/notification";

export default class FavoriteShareBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      status: "request"
    };
  }

  componentDidMount() {
    const { history } = this.props;
    const { id, tab } = this.props.matchParams;

    if (id && tab) {
      api.favorite
        .getShareList(id)
        .then(res => {
          const { items } = res.data.data;
          if (items.length) {
            const productType = items[0].product_type;

            switch (tab) {
              case "diamond":
                if (productType !== "diamonds") {
                  throw new Error();
                }
                break;
              case "engagement":
                if (productType !== "engagement-rings") {
                  throw new Error();
                }
                break;
              case "wedding":
                if (productType !== "wedding-rings") {
                  throw new Error();
                }
                break;
            }
          }

          this.setState({
            status: "success",
            data: items
          });
        })
        .catch(err => {
          this.setState({ status: "failure" });
          if (err.response) {
            notification("error", err.response.data.message);
          } else {
            notification("error", "Something went wrong");
          }
        });
    } else {
      history.push(routing().root);
    }
  }

  render() {
    const { status, data } = this.state;
    const { tab, id } = this.props.matchParams;

    return (
      <section className="fav-and-compare-section">
        <div className="container">
          <p className="section-title section-title--type2">
            Shared Favourites #{id}
          </p>
          <div className="col">
            <FavoriteShareList currentTab={tab} status={status} data={data} />
          </div>
        </div>
      </section>
    );
  }
}
