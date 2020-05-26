import { createRoutine } from "redux-saga-routines";
import { all, call, put, takeLatest , getContext } from "redux-saga/effects";
import { delay } from "redux-saga";
import routing from "../../config/routing";

export const fetchQuickSearch = createRoutine("SEARCH_QUICK_FETCH");
export const saveSearchQuery = createRoutine("SEARCH_QUERY_SAVE");

export const fetchSearchCount = createRoutine("SEARCH_COUNT_FETCH");

export const fetchDiamondSearch = createRoutine("SEARCH_DIAMONDS_FETCH");
export const fetchDiamondNextPageSearch = createRoutine(
  "SEARCH_NEXT_DIAMONDS_FETCH"
);

export const fetchEngagementSearch = createRoutine("SEARCH_ENGAGEMENT_FETCH");
export const fetchEngagementNextPageSearch = createRoutine(
  "SEARCH_NEXT_ENGAGEMENT_FETCH"
);

export const fetchWeddingSearch = createRoutine("SEARCH_WEDDING_FETCH");
export const fetchWeddingNextPageSearch = createRoutine(
  "SEARCH_NEXT_WEDDING_FETCH"
);

export const fetchBlogSearch = createRoutine("SEARCH_BLOG_FETCH");
export const fetchBlogNextPageSearch = createRoutine("SEARCH_NEXT_BLOG_FETCH");

export const fetchPendantSearch = createRoutine("SEARCH_PENDANT_FETCH");
export const fetchPendantNextPageSearch = createRoutine("SEARCH_NEXT_PENDANT_FETCH");

export const fetchEarringsSearch = createRoutine("SEARCH_EARRINGS_FETCH");
export const fetchEarringsNextPageSearch = createRoutine("SEARCH_NEXT_EARRINGS_FETCH");

export const fetchBraceletsSearch = createRoutine("SEARCH_BRACELETS_FETCH");
export const fetchBraceletsNextPageSearch = createRoutine("SEARCH_NEXT_BRACELETS_FETCH");

function* tabFetch(action, tab, payload) {
  yield put(action.request());
  try {
    let res;
    const api = yield getContext('api');

    switch (tab) {
      case "blog":
        res = yield call(() => api.search.getBlog(payload));
        break;
      case "diamond":
        res = yield call(() => api.search.getDiamond(payload));
        break;
      case "engagement":
        res = yield call(() => api.search.getEngagement(payload));
        break;
      case "wedding":
        res = yield call(() => api.search.getWedding(payload));
        break;
      case "pendant":
        res = yield call(() => api.search.getPendant(payload));
        break;
      case "earrings":
        res = yield call(() => api.search.getEarrings(payload));
        break;
      case "bracelets":
        res = yield call(() => api.search.getBracelets(payload));
        break;
    }
    yield put(action.success(res.data));
  } catch (err) {
    yield put(action.failure());

  }
}

function* diamondTabWorker({ payload }) {
  yield call(() => tabFetch(fetchDiamondSearch, "diamond", payload));
}

function* diamondNextTabWorker({ payload }) {
  yield call(() => tabFetch(fetchDiamondNextPageSearch, "diamond", payload));
}

function* engagementTabWorker({ payload }) {
  yield call(() => tabFetch(fetchEngagementSearch, "engagement", payload));
}

function* engagementNextTabWorker({ payload }) {
  yield call(() =>
    tabFetch(fetchEngagementNextPageSearch, "engagement", payload)
  );
}

function* weddingTabWorker({ payload }) {
  yield call(() => tabFetch(fetchWeddingSearch, "wedding", payload));
}

function* weddingNextTabWorker({ payload }) {
  yield call(() => tabFetch(fetchWeddingNextPageSearch, "wedding", payload));
}

function* blogTabWorker({ payload }) {
  yield call(() => tabFetch(fetchBlogSearch, "blog", payload));
}

function* blogNextTabWorker({ payload }) {
  yield call(() => tabFetch(fetchBlogNextPageSearch, "blog", payload));
}

function* pendantTabWorker({ payload }) {
  yield call(() => tabFetch(fetchPendantSearch, "pendant", payload));
}

function* pendantNextTabWorker({ payload }) {
  yield call(() => tabFetch(fetchPendantNextPageSearch, "pendant", payload));
}

function* earringsTabWorker({ payload }) {
  yield call(() => tabFetch(fetchEarringsSearch, "earrings", payload));
}

function* earringsNextTabWorker({ payload }) {
  yield call(() => tabFetch(fetchEarringsNextPageSearch, "earrings", payload));
}

function* braceletsTabWorker({ payload }) {
  yield call(() => tabFetch(fetchBraceletsSearch, "bracelets", payload));
}

function* braceletsNextTabWorker({ payload }) {
  yield call(() => tabFetch(fetchBraceletsNextPageSearch, "bracelets", payload));
}

function* quickResultsWorker({ payload }) {
  yield call(delay, 400);
  yield put(fetchQuickSearch.request());
  try {
    const api = yield getContext('api');
    const res = yield call(() => api.search.quickResults(payload));
    yield put(fetchQuickSearch.success(res.data));
  } catch (err) {
    yield put(fetchQuickSearch.failure());

  }
}

function* fetchTabCountWorker({ payload }) {
  yield put(fetchSearchCount.request());
  try {
    const api = yield getContext('api');
    const res = yield call(() => api.search.getCount(payload.query));
    yield put(fetchSearchCount.success(res.data));
  } catch (err) {
    yield put(fetchSearchCount.failure());

  }
}

function* syncUrlWithQueryWorker({ payload }) {
  yield call(() => payload.push(routing(payload.query).search));
}

export function* searchWatcher() {
  yield all([
    takeLatest(fetchQuickSearch.TRIGGER, quickResultsWorker),

    takeLatest(saveSearchQuery.TRIGGER, syncUrlWithQueryWorker),
    takeLatest(saveSearchQuery.TRIGGER, fetchTabCountWorker),
    takeLatest(fetchSearchCount.TRIGGER, fetchTabCountWorker),

    takeLatest(fetchDiamondSearch.TRIGGER, diamondTabWorker),
    takeLatest(fetchEngagementSearch.TRIGGER, engagementTabWorker),
    takeLatest(fetchWeddingSearch.TRIGGER, weddingTabWorker),
    takeLatest(fetchBlogSearch.TRIGGER, blogTabWorker),
    takeLatest(fetchPendantSearch.TRIGGER, pendantTabWorker),
    takeLatest(fetchEarringsSearch.TRIGGER, earringsTabWorker),
    takeLatest(fetchBraceletsSearch.TRIGGER, braceletsTabWorker),

    takeLatest(fetchDiamondNextPageSearch.TRIGGER, diamondNextTabWorker),
    takeLatest(fetchEngagementNextPageSearch.TRIGGER, engagementNextTabWorker),
    takeLatest(fetchWeddingNextPageSearch.TRIGGER, weddingNextTabWorker),
    takeLatest(fetchBlogNextPageSearch.TRIGGER, blogNextTabWorker),
    takeLatest(fetchPendantNextPageSearch.TRIGGER, pendantNextTabWorker),
    takeLatest(fetchEarringsNextPageSearch.TRIGGER, earringsNextTabWorker),
    takeLatest(fetchBraceletsNextPageSearch.TRIGGER, braceletsNextTabWorker),
  ]);
}
