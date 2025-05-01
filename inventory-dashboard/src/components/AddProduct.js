import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, MenuItem } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import LockIcon from '@mui/icons-material/Lock';
import InputAdornment from '@mui/material/InputAdornment';

function generateSKU(category) {
  if (!category) return '';
  // Use the first letter of each word in the category as a prefix
  const prefix = category
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
  // Generate a random 6-digit number
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomNum}`;
}

export default function AddProduct({ onClose, onProductAdded }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    stock: '',
    price: '',
    status: '',
    sku: '',
    expiry: '',
    description: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setForm(form => ({
        ...form,
        category: value,
        sku: generateSKU(value)
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const stockNum = Number(form.stock);
      let status = 'In Stock';
      if (stockNum === 0) status = 'Out of Stock';
      else if (stockNum > 0 && stockNum <= 20) status = 'Low Stock';

      const payload = {
        ...form,
        stock: stockNum,
        price: Number(form.price),
        expiry: form.expiry, // should be YYYY-MM-DD
        status,
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, payload, { withCredentials: true });
      if (onProductAdded) onProductAdded(); // Notify parent to refresh list
      onClose();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        // Laravel validation error
        setError(Object.values(err.response.data.errors).flat().join(' '));
      } else {
        setError('Failed to add product');
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: 400,
        p: 3,
        bgcolor: 'white',
        borderRadius: 3,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        position: 'relative',
        height: '100vh',
        justifyContent: 'flex-start',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} width="100%">
        <Typography variant="h5" fontWeight="bold">Add Product</Typography>
        <IconButton onClick={onClose} size="large">
          <ArrowForwardIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}
      <TextField
        label="SKU"
        name="sku"
        value={form.sku}
        fullWidth
        required
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <LockIcon sx={{ color: '#b0b0b0' }} />
            </InputAdornment>
          ),
          style: { backgroundColor: '#f5f5f5', borderRadius: 4 },
        }}
        variant="filled"
      />
      <TextField label="Product Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
      <TextField
        select
        label="Product Category"
        name="category"
        value={form.category}
        onChange={handleChange}
        fullWidth
        required
      >
        <MenuItem value="">Select Category</MenuItem>
        <MenuItem value="Meat & Proteins">Meat & Proteins</MenuItem>
        <MenuItem value="Fresh Produce">Fresh Produce</MenuItem>
        <MenuItem value="Dry Goods & Staples">Dry Goods & Staples</MenuItem>
        <MenuItem value="Dairy & Eggs">Dairy & Eggs</MenuItem>
        <MenuItem value="Bar & Beverage">Bar & Beverage</MenuItem>
        <MenuItem value="Sauces & Condiments">Sauces & Condiments</MenuItem>
        <MenuItem value="Disposables & Packaging">Disposables & Packaging</MenuItem>
        <MenuItem value="Cleaning & Sanitation">Cleaning & Sanitation</MenuItem>
      </TextField>
      <TextField label="Stock" name="stock" value={form.stock} onChange={handleChange} type="number" fullWidth required />
      <TextField label="Price" name="price" value={form.price} onChange={handleChange} type="number" fullWidth required />
      <TextField
        label="Expiry"
        name="expiry"
        value={form.expiry}
        onChange={handleChange}
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline minRows={3} />
      <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: '#a31515', mt: 1, fontWeight: 'bold', fontSize: 18 }}>
        ADD PRODUCT
      </Button>
    </Box>
  );
}