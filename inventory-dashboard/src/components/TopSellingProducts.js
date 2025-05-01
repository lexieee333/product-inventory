import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import axios from 'axios';

export default function TopSellingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}/api/products`, { withCredentials: true })
      .then(response => {
        // Sort products by stock in ascending order (lowest stock first)
        const sortedProducts = response.data
          .sort((a, b) => Number(a.stock) - Number(b.stock))
          .slice(0, 3); // Take top 3 products with lowest stock
        setProducts(sortedProducts);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Paper sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Top selling Products</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#a31515' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>SKU</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} align="center"><CircularProgress size={20} /></TableCell></TableRow>
            ) : (
              Array.from({ length: 3 }).map((_, idx) => {
                const product = products[idx];
                return (
                  <TableRow key={product?.id || idx}>
                    <TableCell>{product?.name || '-'}</TableCell>
                    <TableCell>{product?.sku || '-'}</TableCell>
                    <TableCell>{product?.stock || '-'}</TableCell>
                    <TableCell>{product ? `$${Number(product.price).toFixed(2)}` : '-'}</TableCell>
                    <TableCell>{product?.status || '-'}</TableCell>
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