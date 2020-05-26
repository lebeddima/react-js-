import { createRoutine } from "redux-saga-routines";
import { withRouter } from "react-router-dom";
import { all, call, put, select, takeLatest , getContext } from "redux-saga/effects";
import { difference } from "lodash";
import favoriteSelectors from "../_selectors/favoriteSelectors";
import compareSelectors from "../_selectors/compareSelectors";

import notification from "../../utils/notification";

export const addDiamondToFav = createRoutine("FAVORITE_DIAMOND_ADD");
export const addEngagementToFav = createRoutine("FAVORITE_ENGAGEMENT_RING_ADD");
export const addWeddingToFav = createRoutine("FAVORITE_WEDDING_RING_ADD");

export const addProductToFav = createRoutine("FAVORITE_PRODUCT_ADD");
export const addPendantToFav = createRoutine("FAVORITE_PENDANT_ADD");
export const addEarringToFav = createRoutine("FAVORITE_EARRING_ADD");
export const addBraceletToFav = createRoutine("FAVORITE_BRACELET_ADD");

export const addDiamondsFromFavToCompare = createRoutine("FAV_TO_COMPARE_DIAMONDS_ADD");
export const addEngagementsFromFavToCompare = createRoutine("FAV_TO_COMPARE_ENGAGEMENT_RINGS_ADD");
export const addWeddingsFromFavToCompare = createRoutine("FAV_TO_COMPARE_WEDDING_RINGS_ADD");

export const addProductsFromFavToCompare = createRoutine("FAV_TO_COMPARE_PRODUCTS_ADD");
export const addPendantsFromFavToCompare = createRoutine("FAV_TO_COMPARE_PENDANTS_ADD");
export const addEarringsFromFavToCompare = createRoutine("FAV_TO_COMPARE_EARRINGS_ADD");
export const addBraceletsFromFavToCompare = createRoutine("FAV_TO_COMPARE_BRACELETS_ADD");

export const removeDiamondFromFav = createRoutine("FAVORITE_DIAMOND_REMOVE");
export const removeEngagementFromFav = createRoutine("FAVORITE_ENGAGEMENT_RING_REMOVE");
export const removeWeddingFromFav = createRoutine("FAVORITE_WEDDING_RING_REMOVE");

export const removeProductFromFav = createRoutine("FAVORITE_PRODUCT_REMOVE");
export const removePendantFromFav = createRoutine("FAVORITE_PENDANT_REMOVE");
export const removeEarringFromFav = createRoutine("FAVORITE_EARRING_REMOVE");
export const removeBraceletFromFav = createRoutine("FAVORITE_BRACELET_REMOVE");

export const removeAllFromFav = createRoutine("FAVORITE_ALL_REMOVE");
export const removeAllDiamondFromFav = createRoutine("FAVORITE_ALL_DIAMONDS_REMOVE");
export const removeAllEngagementFromFav = createRoutine("FAVORITE_ALL_ENGAGEMENTS_REMOVE");
export const removeAllWeddingFromFav = createRoutine("FAVORITE_ALL_WEDDINGS_REMOVE");

export const removeAllProductFromFav = createRoutine("FAVORITE_ALL_PRODUCTS_REMOVE");
export const removeAllPendantFromFav = createRoutine("FAVORITE_ALL_PENDANTS_REMOVE");
export const removeAllEarringFromFav = createRoutine("FAVORITE_ALL_EARRINGS_REMOVE");
export const removeAllBraceletFromFav = createRoutine("FAVORITE_ALL_BRACELETS_REMOVE");

export const fetchFavorites = createRoutine("FAVORITE_FETCH");
export const syncFavorites = createRoutine("FAVORITE_UPDATE");

export const fetchDiamondsFav = createRoutine("FAVORITE_DIAMONDS_FETCH");
export const fetchEngagementRingsFav = createRoutine("FAVORITE_ENGAGEMENT_RINGS_FETCH");
export const fetchWeddingRingsFav = createRoutine("FAVORITE_WEDDING_RINGS_FETCH");

export const fetchProductsFav = createRoutine("FAVORITE_PRODUCTS_FETCH");


function* pushFavToCompare(action, url, type) {
  try {
    const favorite = yield select(favoriteSelectors.tabData, type);
    const compare = yield select(compareSelectors.tabData, type);

    const differentKeys = yield difference(favorite.keys, compare.keys);
    if (!differentKeys.length) {

      notification("info", "Current items already in favourites");
      return;
    }

    const availableSize = 6 - compare.keys.length;
    if (availableSize === 0) {

      notification(
        "error",
        "Can't add this items because of limit - maximum 6 items per category"
      );
      return;
    }

    const slicedDifferentKeys = differentKeys.slice(0, availableSize);

    yield call(() => url({ id: slicedDifferentKeys }));
    const data = favorite.items.filter(item =>
      slicedDifferentKeys.includes(item.id)
    );


    if (slicedDifferentKeys.length < differentKeys.length) {

      notification(
        "info",
        "Can't add some of items because of limit - maximum 6 items per category"
      );
    } else {
      notification("success", "All items has been added");
    }

    yield put(action.success(data));
  } catch (err) {
    notification("error", "Something went wrong");
    yield put(action.failure());
  }
}

function* getList(action, url) {
  yield put(action.request());
  try {
    const res = yield call(() => url());
    yield put(action.success(res.data.data.items));
  } catch (err) {
    yield put(action.failure());

  }
}

function* makeFetch(action, url, params) {

  yield put(action.request());
  try {
    const res = yield call(() => url(params ? { id: params.id } : undefined));
    yield put(action.success(res.data));
  } catch (err) {
    switch (err.response.status) {
      case 404:
        yield put(action.fulfill(params));
        notification("error", err.response.data.message);
        break;
      default:
        yield put(action.failure(params));

    }
  }
}

function* pushAddDiamondWorker({ payload }) {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(addDiamondToFav, api.favorite.addDiamond, payload)
  );
}

function* pushAddEngagementWorker({ payload }) {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(addEngagementToFav, api.favorite.addEngagementRing, payload)
  );
}

function* pushAddWeddingWorker({ payload }) {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(addWeddingToFav, api.favorite.addWeddingRing, payload)
  );
}
function* pushAddProductWorker({ payload }) {
  const api = yield getContext('api');
  const type = yield select(favoriteSelectors.category);

  yield call(() =>
    makeFetch(addProductToFav, api.favorite.addProduct, payload)
  );
}
function* pushAddPendantWorker({ payload }) {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(addPendantToFav, api.favorite.addProduct, payload)
  );
}
function* pushAddEarringWorker({ payload }) {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(addEarringToFav, api.favorite.addProduct, payload)
  );
}
function* pushAddBraceletWorker({ payload }) {

  const api = yield getContext('api');
  yield call(() =>
    makeFetch(addBraceletToFav, api.favorite.addProduct, payload)
  );
}

function* pushRemoveDiamondWorker({ payload }) {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(removeDiamondFromFav, api.favorite.removeDiamond, payload)
  );
}

function* pushRemoveEngagementWorker({ payload }) {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(
      removeEngagementFromFav,
      api.favorite.removeEngagementRing,
      payload
    )
  );
}

function* pushRemoveWeddingWorker({ payload }) {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(removeWeddingFromFav, api.favorite.removeWeddingRing, payload)
  );
}
function* pushRemoveProductWorker({ payload }) {
  const api = yield getContext('api');
  const type = yield select(favoriteSelectors.category);
  yield call(() =>
    makeFetch(removeProductFromFav, api.favorite.removeProduct, payload)
  );
}
function* pushRemovePendantWorker({ payload }) {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(removePendantFromFav, api.favorite.removeProduct, payload)
  );
}
function* pushRemoveEarringWorker({ payload }) {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(removeEarringFromFav, api.favorite.removeProduct, payload)
  );
}
function* pushRemoveBraceletWorker({ payload }) {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(removeBraceletFromFav, api.favorite.removeProduct, payload)
  );
}

function* pushRemoveAllDiamondWorker() {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(removeAllDiamondFromFav, api.favorite.removeAllDiamonds)
  );
}

function* pushRemoveAllEngagementWorker() {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(removeAllEngagementFromFav, api.favorite.removeAllEngagementRings)
  );
}

function* pushRemoveAllWeddingWorker() {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(removeAllWeddingFromFav, api.favorite.removeAllWeddingRings)
  );
}
function* pushRemoveAllProductWorker() {
  const api = yield getContext('api');
  const type = yield select(favoriteSelectors.category);
  yield call(() =>
    makeFetch(removeAllProductFromFav, api.favorite.removeAllProducts)
  );
}
function* pushRemoveAllPendantWorker() {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(removeAllPendantFromFav, api.favorite.removeAllProducts)
  );
}
function* pushRemoveAllEarringWorker() {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(removeAllEarringFromFav, api.favorite.removeAllProducts)
  );
}
function* pushRemoveAllBraceletWorker() {
  const api = yield getContext('api');
  yield call(() =>
    makeFetch(removeAllBraceletFromFav, api.favorite.removeAllProducts)
  );
}

function* pushAddAllDiamondsToCompareWorker() {
  const api = yield getContext('api');
  yield call(() =>
    pushFavToCompare(
      addDiamondsFromFavToCompare,
      api.compare.addDiamond,
      "diamond"
    )
  );
}

function* pushAddAllEngagementsToCompareWorker() {
  const api = yield getContext('api');
  yield call(() =>
    pushFavToCompare(
      addEngagementsFromFavToCompare,
      api.compare.addEngagementRing,
      "engagement"
    )
  );
}

function* pushAddAllWeddingsToCompareWorker() {
  const api = yield getContext('api');
  yield call(() =>
    pushFavToCompare(
      addWeddingsFromFavToCompare,
      api.compare.addWeddingRing,
      "wedding"
    )
  );
}
function* pushAddAllProductsToCompareWorker() {
  const api = yield getContext('api');
  const type = yield select(favoriteSelectors.category);
  yield call(() =>
    pushFavToCompare(
      addProductsFromFavToCompare,
      api.compare.addProduct,
      'products'
    )
  );
}
function* pushAddAllPendantsToCompareWorker() {
  const api = yield getContext('api');
  yield call(() =>
    pushFavToCompare(
      addPendantsFromFavToCompare,
      api.compare.addProduct,
      'pendant'
    )
  );
}
function* pushAddAllEarringsToCompareWorker() {
  const api = yield getContext('api');
  yield call(() =>
    pushFavToCompare(
      addEarringsFromFavToCompare,
      api.compare.addProduct,
      'earring'
    )
  );
}
function* pushAddAllBraceletsToCompareWorker() {
  const api = yield getContext('api');
  yield call(() =>
    pushFavToCompare(
      addBraceletsFromFavToCompare,
      api.compare.addProduct,
      'bracelet'
    )
  );
}

export function* fetchFavoritesWorker() {
  yield put(fetchFavorites.request());
  try {
    const api = yield getContext('api');
    const res = yield call(() => api.favorite.getFavorites());
    yield put(fetchFavorites.success(res.data.data));
  } catch (e) {
    yield put(fetchFavorites.failure());

  }
}

function* updateFavoritesWorker() {
  yield put(syncFavorites.request());
  try {
    const api = yield getContext('api');
    const res = yield call(() => api.favorite.getFavorites());
    yield put(syncFavorites.success(res.data.data));
  } catch (e) {
    yield put(syncFavorites.failure());

  }
}

function* fetchDiamondWorker() {
  const api = yield getContext('api');
  yield call(() => getList(fetchDiamondsFav, api.favorite.getDiamonds));
}

function* fetchEngagementWorker() {
  const api = yield getContext('api');
  yield call(() =>
    getList(fetchEngagementRingsFav, api.favorite.getEngagementRings)
  );
}
function* fetchWeddingWorker() {
  const api = yield getContext('api');
  yield call(() => getList(fetchWeddingRingsFav, api.favorite.getWeddingRings));
}
function* fetchProductWorker() {
  const api = yield getContext('api');
   yield select(favoriteSelectors.category);
   yield call(() => getList(fetchProductsFav, api.favorite.getProducts));

}



export function* favoriteWatcher() {

  yield all([
    takeLatest(fetchFavorites.TRIGGER, fetchFavoritesWorker),
    takeLatest(syncFavorites.TRIGGER, updateFavoritesWorker),
    takeLatest(fetchDiamondsFav.TRIGGER, fetchDiamondWorker),
    takeLatest(fetchEngagementRingsFav.TRIGGER, fetchEngagementWorker),
    takeLatest(fetchWeddingRingsFav.TRIGGER, fetchWeddingWorker),
    takeLatest(fetchProductsFav.TRIGGER, fetchProductWorker),


    takeLatest(addDiamondToFav.TRIGGER, pushAddDiamondWorker),
    takeLatest(addEngagementToFav.TRIGGER, pushAddEngagementWorker),
    takeLatest(addWeddingToFav.TRIGGER, pushAddWeddingWorker),
    takeLatest(addProductToFav.TRIGGER, pushAddProductWorker),
    takeLatest(addPendantToFav.TRIGGER, pushAddPendantWorker),
    takeLatest(addEarringToFav.TRIGGER, pushAddEarringWorker),
    takeLatest(addBraceletToFav.TRIGGER, pushAddBraceletWorker),

    takeLatest(removeDiamondFromFav.TRIGGER, pushRemoveDiamondWorker),
    takeLatest(removeEngagementFromFav.TRIGGER, pushRemoveEngagementWorker),
    takeLatest(removeWeddingFromFav.TRIGGER, pushRemoveWeddingWorker),
    takeLatest(removeProductFromFav.TRIGGER, pushRemoveProductWorker),
    takeLatest(removePendantFromFav.TRIGGER, pushRemovePendantWorker),
    takeLatest(removeEarringFromFav.TRIGGER, pushRemoveEarringWorker),
    takeLatest(removeBraceletFromFav.TRIGGER, pushRemoveBraceletWorker),

    takeLatest(removeAllDiamondFromFav.TRIGGER, pushRemoveAllDiamondWorker),
    takeLatest(removeAllEngagementFromFav.TRIGGER, pushRemoveAllEngagementWorker),
    takeLatest(removeAllWeddingFromFav.TRIGGER, pushRemoveAllWeddingWorker),
    takeLatest(removeAllProductFromFav.TRIGGER, pushRemoveAllProductWorker),
    takeLatest(removeAllPendantFromFav.TRIGGER, pushRemoveAllPendantWorker),
    takeLatest(removeAllEarringFromFav.TRIGGER, pushRemoveAllEarringWorker),
    takeLatest(removeAllBraceletFromFav.TRIGGER, pushRemoveAllBraceletWorker),

    takeLatest(addDiamondsFromFavToCompare.TRIGGER, pushAddAllDiamondsToCompareWorker),
    takeLatest(addEngagementsFromFavToCompare.TRIGGER, pushAddAllEngagementsToCompareWorker),
    takeLatest(addWeddingsFromFavToCompare.TRIGGER, pushAddAllWeddingsToCompareWorker),
    takeLatest(addProductsFromFavToCompare.TRIGGER, pushAddAllProductsToCompareWorker),
    takeLatest(addPendantsFromFavToCompare.TRIGGER, pushAddAllPendantsToCompareWorker),
    takeLatest(addEarringsFromFavToCompare.TRIGGER, pushAddAllEarringsToCompareWorker),
    takeLatest(addBraceletsFromFavToCompare.TRIGGER, pushAddAllBraceletsToCompareWorker)
  ]);
}
