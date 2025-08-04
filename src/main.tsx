import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { CategoryProvider } from "./context/CategoryContext";
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
      
        <ChakraProvider value={defaultSystem}>
            <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
         <CategoryProvider>
      <App />
         </CategoryProvider>
         </SnackbarProvider>
      </ChakraProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
