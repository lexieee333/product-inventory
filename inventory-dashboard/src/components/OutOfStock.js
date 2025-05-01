import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

export default function OutOfStock() {
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}/api/products`, { withCredentials: true })
      .then(response => {
        const outOfStock = response.data.filter(p => Number(p.stock) === 0);
        setOutOfStockProducts(outOfStock);
      })
      .catch(() => setOutOfStockProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Paper sx={{ flex: 1, p: 2, minWidth: 350, mr: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">Out of Stock</Typography>
        <Button size="small">view all</Button>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Out of Stock Since</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} align="center"><CircularProgress size={20} /></TableCell></TableRow>
            ) : (
              Array.from({ length: 5 }).map((_, idx) => {
                const item = outOfStockProducts[idx];
                const outOfStockDate = item?.out_of_stock_date 
                  ? new Date(item.out_of_stock_date).toLocaleDateString()
                  : '-';
                return (
                  <TableRow key={item?.id || idx}>
                    <TableCell>{item?.name || '-'}</TableCell>
                    <TableCell>{item?.sku || '-'}</TableCell>
                    <TableCell>{outOfStockDate}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
} 