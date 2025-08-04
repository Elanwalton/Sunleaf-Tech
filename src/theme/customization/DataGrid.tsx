// src/components/CustomDataGrid.tsx

import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { alpha, useTheme, styled } from '@mui/material/styles';
import { checkboxClasses } from '@mui/material/Checkbox';
import { tablePaginationClasses } from '@mui/material/TablePagination';
import { gridClasses } from '@mui/x-data-grid';

const StyledDataGridPro = styled(DataGrid)(({ theme }) => ({
  '--DataGrid-overlayHeight': '300px',
  overflow: 'clip',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: (theme.vars || theme).palette.background.default,

  [`& .${gridClasses.columnHeader}`]: {
    backgroundColor: (theme.vars || theme).palette.background.paper,
    fontWeight: 600,
  },

  [`& .${gridClasses.footerContainer}`]: {
    backgroundColor: (theme.vars || theme).palette.background.paper,
  },

  [`& .${checkboxClasses.root}`]: {
    padding: theme.spacing(0.5),
    '& svg': {
      fontSize: '1rem',
    },
  },

  [`& .${tablePaginationClasses.root}`]: {
    marginRight: theme.spacing(1),
    '& .MuiIconButton-root': {
      maxHeight: 32,
      maxWidth: 32,
      '& svg': {
        fontSize: '1rem',
      },
    },
  },

  '& .MuiDataGrid-cell': {
    borderTopColor: (theme.vars || theme).palette.divider,
  },

  '& .MuiDataGrid-row': {
    '&:last-of-type': {
      borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
    },
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.action.hover,
    },
    '&.Mui-selected': {
      background: (theme.vars || theme).palette.action.selected,
      '&:hover': {
        backgroundColor: (theme.vars || theme).palette.action.hover,
      },
    },
  },
}));

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  { field: 'age', headerName: 'Age', type: 'number', width: 90 },
];

const rows = [
  { id: 1, lastName: 'Smith', firstName: 'John', age: 35 },
  { id: 2, lastName: 'Johnson', firstName: 'Mary', age: 42 },
  { id: 3, lastName: 'Williams', firstName: 'Alex', age: 28 },
  { id: 4, lastName: 'Brown', firstName: 'Sarah', age: 31 },
];

export default function CustomDataGrid() {
  const theme = useTheme();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <StyledDataGridPro
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
}
