import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, Drawer } from '@mui/material';
import OutOfStock from './OutOfStock';
import ExpirationReport from './ExpirationReport';
import TopSellingProducts from './TopSellingProducts';
import AddProduct from './AddProduct';
import ViewProduct from './ViewProduct';
import axios from 'axios';

export default function Dashboard() {
  // Mock data for now
  const totalSales = 123456;
  const unitSold = 2345;
  const [currentStock, setCurrentStock] = useState(0);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showViewProduct, setShowViewProduct] = useState(false);
  const [refreshProducts, setRefreshProducts] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/products`, { withCredentials: true })
      .then(response => {
        const total = response.data.reduce((sum, p) => sum + Number(p.stock), 0);
        setCurrentStock(total);
      })
      .catch(() => setCurrentStock(0));
  }, [refreshProducts]);

  return (
    <Box sx={{ marginLeft: 30, padding: 4 }}>
      {/* Header and action buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Overview</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            track and manage inventory, sales and transactions
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#a31515', mr: 2 }}
            onClick={() => {
              setShowAddProduct(true);
              setShowViewProduct(false);
            }}
          >
            Add Product
          </Button>
          <Button
            variant="outlined"
            sx={{ color: '#a31515', borderColor: '#a31515' }}
            onClick={() => {
              setShowViewProduct(true);
              setShowAddProduct(false);
            }}
          >
            View Product
          </Button>
        </Box>
      </Box>
      {/* Stats cards */}
      <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
        <Grid span={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Total Sales</Typography>
            <Typography variant="h3" fontWeight="bold">${totalSales.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid span={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Unit Sold</Typography>
            <Typography variant="h3" fontWeight="bold">{unitSold}</Typography>
          </Paper>
        </Grid>
        <Grid span={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Current Stock</Typography>
            <Typography variant="h3" fontWeight="bold">{currentStock}</Typography>
          </Paper>
        </Grid>
      </Grid>
      {/* Out of Stock and Expiration Reports side by side */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <OutOfStock />
        <ExpirationReport />
      </Box>
      {/* Top Selling Products below */}
      <Box sx={{ mt: 2 }}>
        <TopSellingProducts />
      </Box>
      <Drawer anchor="right" open={showAddProduct} onClose={() => setShowAddProduct(false)}>
        <Box sx={{ width: 420, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AddProduct
            onClose={() => setShowAddProduct(false)}
            onProductAdded={() => setRefreshProducts(r => !r)}
          />
        </Box>
      </Drawer>
      <Drawer anchor="right" open={showViewProduct} onClose={() => setShowViewProduct(false)}>
        <Box sx={{ width: 900, height: '100vh', bgcolor: 'white' }}>
          <ViewProduct onClose={() => setShowViewProduct(false)} refresh={refreshProducts} />
        </Box>
      </Drawer>
    </Box>
  );
} 