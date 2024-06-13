// _app.jsx

import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConnectionStatus from '@/components/Connectionspeed';
function MyApp({ Component, pageProps }) {
  // You can use this useEffect for global side effects
  useEffect(() => {
    // Your global side effects here
  }, []);

  return (
    <>
     <ConnectionStatus/>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;


