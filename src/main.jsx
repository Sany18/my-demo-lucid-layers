import { RouterProvider } from 'react-router-dom';
import { providerWrapper } from 'services/reactProvider/providerWrapper';
import { LocalStorageProvider } from 'services/localStorage/localStorage.hook';
import ReactDOM from 'react-dom/client';

import { RecoilRoot } from 'recoil';

import { router } from 'pages/router.tsx';

import 'assets/css/index.css';

const licenseUrl = new URL('../public/luciad/license/luciadria_development.txt', import.meta.url).href;
window.__LUCIAD_ROOT__ = '/' + licenseUrl.split('/').slice(4, 5).join('/');
console.log('Luciad license URL:', window.__LUCIAD_ROOT__, licenseUrl);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  providerWrapper(
    LocalStorageProvider,
    RecoilRoot,
    RouterProvider, { router }
  )
);
