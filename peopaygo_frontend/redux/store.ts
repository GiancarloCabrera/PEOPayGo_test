import { combineReducers, configureStore } from '@reduxjs/toolkit';
import accessTokenReducer from './features/accessToken';
import { clientApi } from './api/clientApi';
import { setupListeners } from '@reduxjs/toolkit/query';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { timesheetApi } from './api/timesheetApi';
import { employeeApi } from './api/employeeApi';

const accessTokenPersistConfig = {
  key: 'accessToken',
  storage,
  witheList: ['access_token']
}

const rootReducer = combineReducers({
  accessToken: persistReducer(accessTokenPersistConfig, accessTokenReducer),
  [clientApi.reducerPath]: clientApi.reducer,
  [timesheetApi.reducerPath]: timesheetApi.reducer,
  [employeeApi.reducerPath]: employeeApi.reducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat([
        clientApi.middleware,
        timesheetApi.middleware,
        employeeApi.middleware
      ])
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;