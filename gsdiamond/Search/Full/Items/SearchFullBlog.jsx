import React from "react";
import ImageLoader from "../../../_common/ImageLoader";
import routing from "../../../../config/routing";
import { Link } from "react-router-dom";

const SearchFullBlog = ({ item }) => {
  const { image, title, preview_text, slug } = item;

  return (
    <div className="col-12 col-md-6">
      <div className=" slide slide--full slide--full slide--xs-row  slide--search-result ">
        <div className="altlisting-post">
          <div className="altlisting__figure">
            <ImageLoader
              src={image}
              preloadStyles={{ height: "120px", margin: "75px auto" }}
            />
          </div>
          <div className="altlisting-post__name">{title}</div>
          <p className="altlisting-post__text">{preview_text}</p>
          <div className="altlisting-post__readmore">
            <Link className="blog-readmore-link" to={routing(slug).blogArticle}>
              Read more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFullBlog;
