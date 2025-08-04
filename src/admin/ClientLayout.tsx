import React from 'react';
import { Outlet } from 'react-router-dom';
const ClientLayout: React.FC = () => (
  <>
    <Outlet />
  </>
);

export default ClientLayout;
