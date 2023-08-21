import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';
import React,{Suspense} from 'react';
import { baselightTheme } from "./theme/DefaultColors";
import Loading from './loading';
function App() {
  const routing = useRoutes(Router);
  const theme = baselightTheme;
  return (
     <Suspense fallback={<Loading />}>
    <ThemeProvider theme={theme}>     
      <CssBaseline />
      {routing}
    </ThemeProvider>
     </Suspense>
  );
}

export default App;
