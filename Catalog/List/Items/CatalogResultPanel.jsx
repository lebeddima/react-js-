import React from "react";
import ResultPanelWrapper from "../../../Shared/ResultPanel/ResultPanelWrapper";
import CompareAndFaveButtons from "../../../Shared/ResultPanel/CompareAndFaveButtons";
import ResultsCount from "../../../Shared/ResultPanel/ResultsCount";
import PanelViewButtons from "../../../Shared/ResultPanel/PanelViewButtons";
import EngagementSortDropdownContainer from "./CatalogSortDropdownContainer";

const CatalogResultPanel = ({ total, view, changeView, type }) => (
  <ResultPanelWrapper type={type}>
    <PanelViewButtons view={view} handleChange={changeView} />
    <CompareAndFaveButtons type={type} />
    <ResultsCount count={total} />
    <EngagementSortDropdownContainer />
  </ResultPanelWrapper>
);

export default CatalogResultPanel;
