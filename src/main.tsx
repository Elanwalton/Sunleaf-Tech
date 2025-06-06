import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
