import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

export default function ViewProduct({ onClose, refresh }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}/api/products`, { withCredentials: true })
      .then(response => setProducts(response.data))
      .catch(error => console.error('API error:', error))
      .finally(() => setLoading(false));
  }, [refresh]);

  const filteredProducts = products
    .filter(p => p.name && p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.category.localeCompare(b.category));

  // Group products by category
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`, { withCredentials: true });
    // Refresh list
    setProducts(products => products.filter(p => p.id !== id));
  };

  // Edit handlers
  const openEdit = (product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name,
      category: product.category,
      stock: product.stock,
      price: product.price,
      status: product.status,
      sku: product.sku,
      expiry: product.expiry || product.expiry_date,
      description: product.description,
    });
    setEditError('');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    try {
      const payload = {
        ...editForm,
        stock: Number(editForm.stock),
        price: Number(editForm.price),
        expiry: editForm.expiry,
      };
      await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${editProduct.id}`, payload, { withCredentials: true });
      setEditProduct(null);
      // Refresh list
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`, { withCredentials: true });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setEditError(Object.values(err.response.data.errors).flat().join(' '));
      } else {
        setEditError('Failed to update product');
      }
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 4, minHeight: '100vh' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">Products</Typography>
        <IconButton size="large" onClick={onClose}>
          <ArrowForwardIcon sx={{ fontSize: 36 }} />
        </IconButton>
      </Box>
      <Box mb={2}>
        <TextField
          placeholder="Search Products"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, bgcolor: '#fafafa' },
          }}
        />
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                  <React.Fragment key={category}>
                    {categoryProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product, idx) => (
                      <TableRow
                        key={product.id || idx}
                        hover
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                        <TableCell>{product.status}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.expiry || product.expiry_date || 'Not Applicable'}</TableCell>
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center" alignItems="center" gap={0.5}>
                            <IconButton onClick={e => { e.stopPropagation(); openEdit(product); }} size="large">
                              <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                            <IconButton onClick={e => { e.stopPropagation(); handleDelete(product.id); }} color="error" size="large">
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <TablePagination
              component="div"
              count={filteredProducts.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[]}
              labelDisplayedRows={({ from, to, count }) => `${from} - ${to} of ${count}`}
            />
          </Box>
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editProduct} onClose={() => setEditProduct(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {editError && <Typography color="error">{editError}</Typography>}
          <Box component="form" onSubmit={handleEditSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Product Name" name="name" value={editForm.name || ''} onChange={handleEditChange} fullWidth required />
            <TextField label="Product Category" name="category" value={editForm.category || ''} onChange={handleEditChange} fullWidth required />
            <TextField label="Stock" name="stock" value={editForm.stock || ''} onChange={handleEditChange} type="number" fullWidth required />
            <TextField label="Price" name="price" value={editForm.price || ''} onChange={handleEditChange} type="number" fullWidth required />
            <TextField label="Status" name="status" value={editForm.status || ''} onChange={handleEditChange} fullWidth required />
            <TextField label="SKU" name="sku" value={editForm.sku || ''} onChange={handleEditChange} fullWidth required />
            <TextField
              label="Expiry"
              name="expiry"
              value={editForm.expiry || ''}
              onChange={handleEditChange}
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField label="Description" name="description" value={editForm.description || ''} onChange={handleEditChange} fullWidth multiline minRows={3} />
            <DialogActions>
              <Button onClick={() => setEditProduct(null)}>Cancel</Button>
              <Button type="submit" variant="contained">Save</Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Product Details Dialog */}
      <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            color: '#a31515',
            fontSize: 28,
            fontWeight: 'bold'
          }}
        >
          Product Details
        </DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardHeader
                title={selectedProduct.name}
                subheader={
                  <span style={{ color: '#a31515' }}>
                    {selectedProduct.category}
                  </span>
                }
              />
              <CardContent>
                <Typography><b>SKU:</b> {selectedProduct.sku}</Typography>
                <Typography><b>Status:</b> {selectedProduct.status}</Typography>
                <Typography><b>Stock:</b> {selectedProduct.stock}</Typography>
                <Typography><b>Price:</b> ${Number(selectedProduct.price).toFixed(2)}</Typography>
                <Typography><b>Expiry:</b> {selectedProduct.expiry || selectedProduct.expiry_date || 'Not Applicable'}</Typography>
                <Typography><b>Description:</b> {selectedProduct.description || 'No description'}</Typography>
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedProduct(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 