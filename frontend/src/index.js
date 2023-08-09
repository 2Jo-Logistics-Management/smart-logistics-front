import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store'; // Redux store를 가져옵니다.
import Loading from './loading';

const App = React.lazy(() => import('./App'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <Suspense fallback={<Loading />}>
    <Provider store={store}>
      <BrowserRouter>

          <App />
      </BrowserRouter>
    </Provider>
    
    </Suspense>
  </React.StrictMode>
);
