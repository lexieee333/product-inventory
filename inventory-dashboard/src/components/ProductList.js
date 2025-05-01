import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from './components/ProductList';

function DashboardPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/products`)
      .then(response => setProducts(response.data))
      .catch(error => console.error('API error:', error));
  }, []);

  return (
    <div>
      <ProductList />
      {/* Other dashboard content */}
    </div>
  );
}

export default DashboardPage;
