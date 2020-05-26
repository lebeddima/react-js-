import { createRoutine } from "redux-saga-routines";
import { all, call, put, takeLatest, fork, select , getContext } from "redux-saga/effects";
import { delay } from "redux-saga";
import axios from "axios";
import { isServer } from "../../../utils/isServer";
import createMetaSlug from "../../../utils/createMetaSlug";
import {
  fetchSeoTextBlockWorker,
  fetchMetaWorker
} from "../../_common/SEO/SeoActions";
import selectors from "../../_selectors/catalogFeedSelectors";
import { initServerApp } from "../../rootSaga";
import { fetchShapesBlockWorker } from '../../Main/MainActions';

export const setCatalogCategory = createRoutine("SET_CATALOG_CATEGORY");

export const saveCatalogSort = createRoutine("CATALOG_SORT_SAVE");
export const saveCatalogPrice = createRoutine("CATALOG_PRICE_SAVE");
export const saveCatalogShape = createRoutine("CATALOG_SHAPE_SAVE");
export const saveCatalogMetal = createRoutine("CATALOG_METAL_SAVE");
export const saveCatalogStyle = createRoutine("CATALOG_STYLE_SAVE");
export const saveCatalogSize = createRoutine("CATALOG_SIZE_SAVE");
export const saveCatalogOffers = createRoutine("CATALOG_OFFERS_SAVE");
export const saveCatalogBrands = createRoutine(
  "CATALOG_BRANDS_SAVE"
);

export const setCatalogMetal = createRoutine("CATALOG_METAL_SET");
export const setCatalogShape = createRoutine("CATALOG_SHAPE_SET");
export const setCatalogStyle = createRoutine("CATALOG_STYLE_SET");

export const changeCatalogSizeTab = createRoutine("CATALOG_SIZE_CHANGE");
//
// export const setCatalogShape = createRoutine('CATALOG_SHAPE_SET');
// export const expandCatalogFilters = createRoutine('CATALOG_FILTER_EXPAND');
export const toggleCatalogFilter = createRoutine("CATALOG_FILTER_TOGGLE");
export const clearCatalogFilter = createRoutine("CATALOG_FILTER_CLEAR");
export const resetCatalogFilters = createRoutine("CATALOG_FILTERS_RESET");
// export const disableCatalogFilters = createRoutine('CATALOG_FILTERS_DISABLE');
//
// export const enableDiamondsFilterTriple = createRoutine('DIAMONDS_FILTER_TRIPLE_ENABLE');
// export const disableDiamondsFilterTriple = createRoutine('DIAMONDS_FILTER_TRIPLE_DISABLE');
//
export const fetchCatalogFeed = createRoutine("CATALOG_FEED_FETCH");
export const fetchCatalogFeedFilters = createRoutine(
  "CATALOG_FEED_FILTERS_CONFIG_FETCH"
);
export const fetchCatalogFeedNextPage = createRoutine(
  "CATALOG_FEED_NEXT_FETCH"
);

export const fetchCatalogShoppingEasy = createRoutine(
  "CATALOG_FEED_SHOPPING_EASY"
);

export const clearCatalogFilters = createRoutine("CATALOG_FILTERS_CLEAR");

function* fetchShoppingEasyBlockWorker() {
  yield put(fetchCatalogShoppingEasy.request());
  try {
    const api = yield getContext('api');
    const res = yield call(() => api.engagementFeed.getEasyShopping());
    yield put(fetchCatalogShoppingEasy.success(res.data));
  } catch (e) {
    yield put(fetchCatalogShoppingEasy.failure());
  }
}

function* fetchFiltersConfigWorker({ payload }) {
  yield put(fetchCatalogFeedFilters.request());
  try {
    const api = yield getContext('api');
    const res = yield call(() => api.catalogFeed.getFilters(payload));
    yield put(fetchCatalogFeedFilters.success(res.data));
  } catch (e) {
    yield put(fetchCatalogFeedFilters.failure());

  }
}

function generateFilterBody({
  sort,
  price,
  brands,
  offers,
  size,
  shape,
  metal,
  style
}) {
  let body = {};

  if (!price.isDisabled && (price.min !== null) && (price.max !== null)) {
    body["price"] = {
      min: price.min,
      max: price.max
    };
  }

  if (size.sizes.length) {
    body["size"] = size.sizes;
  }

  if (shape.length) {
    body["shape"] = shape;
  }

  if (metal.length) {
    body["metal"] = metal;
  }

  if (style.length) {
    body["style"] = style;
  }

  if (brands.length) {
    body["brands"] = brands;
  }

  if (offers.length) {
    body["offers"] = offers;
  }

  if (sort.field !== null) {
    body["sort"] = sort;
  }

  return body;
}

let feedCancelSource;

function* fetchFeedWorker({ payload = {} }) {
  yield put(fetchCatalogFeed.request());

  // let catalog = isServer ? payload.catalog : payload.payload;

  if (!isServer) {
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

    yield call(delay, 600);
  }

  if (typeof feedCancelSource !== typeof undefined) {
    yield call(() => feedCancelSource.cancel("Test"));
  }

  feedCancelSource = axios.CancelToken.source();
  const config = { cancelToken: feedCancelSource.token };

  try {
    const api = yield getContext('api');
    const body = generateFilterBody(yield select(selectors.filterInput));
    var params = [];

    for (var key in body) {
      if ( typeof body === 'string') {
        params.push(key +'='+ body[key]);
      } else {
        for (var subkey in body[key]) {
          params.push(key+'['+subkey+']='+ body[key][subkey]);
        }
      }
    }

    console.log('filter body => ', params.join('&'));

    const res = yield call(() =>
      api.catalogFeed.getCatalog(
        {
          slug: payload.slug,
          data: {query: params.join('&')},
          page: payload.page,
          perPage: payload.perPage
        },
        config
      )
    );

    yield put(fetchCatalogFeed.success(res.data));
  } catch (e) {
    yield put(fetchCatalogFeed.failure());

  }
}
//
function* fetchFeedNextPageWorker({ payload = {} }) {
  yield put(fetchCatalogFeedNextPage.request());
  try {
    const api = yield getContext('api');
    const body = generateFilterBody(yield select(selectors.filterInput));

    const res = yield call(() =>
      api.catalogFeed.getCatalog({
        slug: payload.slug,
        data: body,
        page: payload.page,
        perPage: payload.perPage
      })
    );

    yield put(fetchCatalogFeedNextPage.success(res.data));
  } catch (e) {
    yield put(fetchCatalogFeedNextPage.failure());

  }
}

function* clearFiltersWorker() {
  const config = yield select(selectors.filterConfig);
  yield put(clearCatalogFilters.success(config));
}

export function* catalogFeedServerWorker({ settings, seo, feed }) {
  const metaSlug = createMetaSlug(seo.page, seo.filter);

  yield fork(initServerApp, settings);
  yield fork(fetchSeoTextBlockWorker, { payload: metaSlug });
  yield fork(fetchMetaWorker, { payload: metaSlug });
  yield fork(fetchFiltersConfigWorker, { payload: seo.page });
  yield fork(fetchFeedWorker, { payload: feed });
  yield fork(fetchShoppingEasyBlockWorker);
  yield fork(fetchShapesBlockWorker);
}

export function* catalogFeedWatcher() {
  yield all([
    takeLatest(fetchCatalogFeed.TRIGGER, fetchFeedWorker),
    takeLatest(fetchCatalogFeedNextPage.TRIGGER, fetchFeedNextPageWorker),
    takeLatest(fetchCatalogFeedFilters.TRIGGER, fetchFiltersConfigWorker),
    takeLatest(clearCatalogFilters.TRIGGER, clearFiltersWorker),
    takeLatest(fetchCatalogShoppingEasy.TRIGGER, fetchShoppingEasyBlockWorker),
  ]);
}
