import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  fetchCatalogFeedFilters,
  saveCatalogShape,
  saveCatalogPrice,
  saveCatalogMetal,
  saveCatalogStyle,
  saveCatalogSize,
  saveCatalogBrands,
  saveCatalogOffers,
  changeCatalogSizeTab,
  toggleCatalogFilter,
  clearCatalogFilter,
  clearCatalogFilters,
  resetCatalogFilters,
  setCatalogShape,
  setCatalogStyle,
  setCatalogMetal
} from "../CatalogFeedActions";
import selectors from "../../../_selectors/catalogFeedSelectors";
import { flowRight as compose } from "lodash";
import FilterPanel from "./FilterPanel";
import { deviceSelector } from '../../../_selectors/deviceSelector';

const mapStateToProps = (state, props) => ({
  status: selectors.filterStatus(state),
  config: selectors.filterConfig(state),
  input: selectors.filterInput(state),
  handleModal: props.handleModal,
  showMobileFilters: props.showMobileFilters,
  forwardRef: props.forwardRef,
  isMobile: deviceSelector(state)
});

const toggleAllMetals = saveCatalogMetal.fulfill;

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    {
      fetchFilters: fetchCatalogFeedFilters,
      changeSizeTab: changeCatalogSizeTab,
      toggle: toggleCatalogFilter,
      clear: clearCatalogFilter,
      clearState: resetCatalogFilters,
      clearFilters: clearCatalogFilters,
      toggleAllMetals,
      saveCatalogShape,
      saveCatalogPrice,
      saveCatalogMetal,
      saveCatalogStyle,
      saveCatalogSize,
      saveCatalogBrands,
      saveCatalogOffers,

      setCatalogShape,
      setCatalogStyle,
      setCatalogMetal
    }
  )
)(FilterPanel);
