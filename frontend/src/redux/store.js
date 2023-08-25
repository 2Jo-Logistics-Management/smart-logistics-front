import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducer'; // rootReducer 파일 경로에 맞게 수정해야 합니다.

const persistConfig = {
  key: 'root',
  storage: localStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
 
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const customMiddleware = getDefaultMiddleware({
      serializableCheck: false,
    });
    return [...customMiddleware, sagaMiddleware];
  },
});

export const persistor = persistStore(store);

export default store;
