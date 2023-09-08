import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store, {persistor} from './redux/store'; // Redux store를 가져옵니다.
import Loading from './loading';
import { PersistGate } from 'redux-persist/integration/react';

const App = React.lazy(() => import('./App'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<Loading />}>
      <Provider store={store}>
        <BrowserRouter>
        <PersistGate
          loading ={null}
          persistor={persistor}>
          <App />
          </PersistGate>
        </BrowserRouter>
      </Provider>
    </Suspense>
  </React.StrictMode>
);
