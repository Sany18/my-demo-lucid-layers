import { RouterProvider } from 'react-router-dom';
import { providerWrapper } from 'services/react-provider/providerWrapper';
import { LocalStorageProvider } from 'services/local-storage/localStorage.hook';
import ReactDOM from 'react-dom/client';

import { RecoilRoot } from 'recoil';

import { router } from 'pages/router.tsx';

import 'assets/css/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  providerWrapper(
    LocalStorageProvider,
    RecoilRoot,
    RouterProvider, { router }
  )
);
