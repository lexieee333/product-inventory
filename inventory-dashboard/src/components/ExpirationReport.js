import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import axios from 'axios';

function isSoonToExpire(expiry) {
  if (!expiry) return false;
  const today = new Date();
  const expiryDate = new Date(expiry);
  const diffTime = expiryDate - today;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 30;
}

export default function ExpirationReport() {
  const [soonToExpire, setSoonToExpire] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}/api/products`, { withCredentials: true })
      .then(response => {
        const soon = response.data
          .filter(p => isSoonToExpire(p.expiry || p.expiry_date))
          .sort((a, b) => new Date(a.expiry || a.expiry_date) - new Date(b.expiry || b.expiry_date))
          .slice(0, 5);
        setSoonToExpire(soon);
      })
      .catch(() => setSoonToExpire([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Paper sx={{ flex: 1, p: 2, minWidth: 350 }}>
      <Typography variant="h6" fontWeight="bold">Expiration Reports</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product name</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Days Until Expiry</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} align="center"><CircularProgress size={20} /></TableCell></TableRow>
            ) : (
              Array.from({ length: 5 }).map((_, idx) => {
                const item = soonToExpire[idx];
                let days = '-';
                if (item?.expiry || item?.expiry_date) {
                  const expiryDate = new Date(item.expiry || item.expiry_date);
                  const today = new Date();
                  days = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                  days = days >= 0 ? days : '-';
                }
                return (
                  <TableRow key={item?.id || idx}>
                    <TableCell>{item?.name || '-'}</TableCell>
                    <TableCell>{item?.expiry || item?.expiry_date || '-'}</TableCell>
                    <TableCell>{days}</TableCell>
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