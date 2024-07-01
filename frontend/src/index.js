import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './providers/authProvider';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<GoogleOAuthProvider clientId="832338382343-ap5t80jdijtsurdp9m7qtm81j18tg4li.apps.googleusercontent.com">
<Toaster  position="bottom-center" expand={true} richColors/>
  <AuthProvider>
    <App />
  </AuthProvider>
  </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
