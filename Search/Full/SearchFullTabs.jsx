import React from "react";

const SearchFullTabs = ({
  tabsCount,
  currentTab,
  tabWithMaxCount,
  handleChange
}) => {
  if (!currentTab) {
    handleChange(tabWithMaxCount);
  }
  return (
    <div className="category-tab category-tab--type2">
      {+tabsCount.diamond !== 0 && (
        <div
          className={`category-tab__item ${
            currentTab === "diamond" ? "active" : ""
          }`}
          onClick={() => handleChange("diamond")}
        >
          Diamonds <span> ({tabsCount.diamond})</span>
        </div>
      )}
      {+tabsCount.engagement !== 0 && (
        <div
          className={`category-tab__item ${
            currentTab === "engagement" ? "active" : ""
          }`}
          onClick={() => handleChange("engagement")}
        >
          Engagement rings <span> ({tabsCount.engagement})</span>
        </div>
      )}
      {+tabsCount.wedding !== 0 && (
        <div
          className={`category-tab__item ${
            currentTab === "wedding" ? "active" : ""
          }`}
          onClick={() => handleChange("wedding")}
        >
          Wedding rings <span> ({tabsCount.wedding})</span>
        </div>
      )}
      {+tabsCount.pendant !== 0 && (
          <div
              className={`category-tab__item ${
                  currentTab === "pendant" ? "active" : ""
              }`}
              onClick={() => handleChange("pendant")}
          >
            Pendant <span> ({tabsCount.pendant})</span>
          </div>
      )}
      {+tabsCount.earrings !== 0 && (
        <div
            className={`category-tab__item ${
                currentTab === "earrings" ? "active" : ""
            }`}
            onClick={() => handleChange("earrings")}
        >
          Earrings <span> ({tabsCount.earrings})</span>
        </div>
    )}
      {+tabsCount.bracelets !== 0 && (
          <div
              className={`category-tab__item ${
                  currentTab === "bracelets" ? "active" : ""
              }`}
              onClick={() => handleChange("bracelets")}
          >
            Bracelets <span> ({tabsCount.bracelets})</span>
          </div>
      )}
      {+tabsCount.blog !== 0 && (
        <div
          className={`category-tab__item ${
            currentTab === "blog" ? "active" : ""
          }`}
          onClick={() => handleChange("blog")}
        >
          Blog <span> ({tabsCount.blog})</span>
        </div>
      )}
    </div>
  );
};

export default SearchFullTabs;
