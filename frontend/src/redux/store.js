import { configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // storage를 import 해줍니다.
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducer';

const persistConfig = {
  key: 'root',
  storage: storage, // 수정된 부분: storage 변수를 사용합니다.
};

const persistedReducer = persistReducer(persistConfig, rootReducer); // 수정된 변수명

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: persistedReducer, // 수정된 변수명
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
    return [...defaultMiddleware, sagaMiddleware];
  },
});

export const persistor = persistStore(store);

export default store;
