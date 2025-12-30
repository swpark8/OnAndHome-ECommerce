import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const categories = ['all', 'TV/Î™®Îãà??, 'TV', '?êÏñ¥Ïª?, '?âÏû•Í≥?, '?∏ÌÉÅÍ∏?, 'Ï£ºÎ∞©Í∞Ä??, '?ÑÏûê?àÏù∏ÏßÄ', '?§Îîî??, '?âÏû•Í≥??∏ÌÉÅÍ∏?, '?ùÍ∏∞?∏Ï≤ôÍ∏?, 'Ï≤?ÜåÍ∏?, 'Í≥µÍ∏∞Ï≤?†ïÍ∏?];
  const statuses = ['all', '?êÎß§Ï§?, '?àÏ†à', '?êÎß§Ï§ëÏ?'];

  useEffect(() => {
    fetchProducts();
  }, [filterCategory, filterStatus]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filterCategory !== 'all') {
        params.append('category', filterCategory);
      }
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      if (searchTerm && searchTerm.trim()) {
        params.append('kw', searchTerm.trim());
      }
      
      const url = `${API_BASE_URL}/api/admin/products${params.toString() ? '?' + params.toString() : ''}`;
      console.log('=== Fetching products ===');
      console.log('URL:', url);
      
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        console.log('Number of products:', response.data.length);
        
        const mappedProducts = response.data.map((product) => ({
          ...product,
          checked: false,
          // ?¨Í≥†Í∞Ä 0?¥Î©¥ ?àÏ†à, ?ÑÎãàÎ©?Î∞±Ïóî???ÅÌÉúÍ∞??†Ï?
          status: product.stock === 0 ? '?àÏ†à' : (product.status || '?êÎß§Ï§?)
        }));
        
        console.log('Mapped products:', mappedProducts);
        setProducts(mappedProducts);
        console.log('Products state updated');
      } else {
        console.warn('Unexpected response format:', response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error('=== ?ÅÌíà Î™©Î°ù Ï°∞Ìöå ?§Ìå® ===');
      console.error('Error object:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        alert('?ÅÌíà Î™©Î°ù??Î∂àÎü¨?§Îäî???§Ìå®?àÏäµ?àÎã§.');
      } else if (error.request) {
        console.error('No response received');
        alert('?úÎ≤Ñ???∞Í≤∞?????ÜÏäµ?àÎã§. ?úÎ≤ÑÍ∞Ä ?§Ìñâ Ï§ëÏù∏ÏßÄ ?ïÏù∏?¥Ï£º?∏Ïöî.');
      } else {
        console.error('Error:', error.message);
      }
      
      setProducts([]);
    } finally {
      setLoading(false);
      setSelectAll(false);
    }
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setProducts(products.map(product => ({ ...product, checked })));
  };

  const handleSelectProduct = (productId) => {
    const updatedProducts = products.map(product => 
      product.id === productId ? { ...product, checked: !product.checked } : product
    );
    setProducts(updatedProducts);
    
    // selectAll Ï≤¥ÌÅ¨Î∞ïÏä§ ?ÅÌÉú ?ÖÎç∞?¥Ìä∏
    const allChecked = updatedProducts.every(product => product.checked);
    setSelectAll(allChecked);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddProduct = () => {
    navigate('/admin/products/create');
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/products/${productId}/edit`);
  };

  const handleDeleteSelected = async () => {
    const selectedProducts = products.filter(product => product.checked);
    
    if (selectedProducts.length === 0) {
      alert('??†ú???ÅÌíà???†ÌÉù?¥Ï£º?∏Ïöî.');
      return;
    }
    
    if (!window.confirm(`?†ÌÉù??${selectedProducts.length}Í∞úÏùò ?ÅÌíà????†ú?òÏãúÍ≤†Ïäµ?àÍπå?\n\n???ëÏóÖ?Ä ?òÎèåÎ¶????ÜÏäµ?àÎã§.`)) {
      return;
    }

    setLoading(true);
    
    try {
      const productIds = selectedProducts.map(product => product.id);
      
      console.log('Deleting products:', productIds);
      
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        alert('Î°úÍ∑∏?∏Ïù¥ ?ÑÏöî?©Îãà?? ?§Ïãú Î°úÍ∑∏?∏Ìï¥Ï£ºÏÑ∏??');
        navigate('/admin/login');
        return;
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/products/delete`,
        { ids: productIds },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Delete response:', response.data);
      
      if (response.data && response.data.success) {
        alert(response.data.message || `${selectedProducts.length}Í∞úÏùò ?ÅÌíà????†ú?òÏóà?µÎãà??`);
        
        // Î™©Î°ù ?àÎ°úÍ≥†Ïπ®
        await fetchProducts();
        setSelectAll(false);
      } else {
        alert(response.data.message || '?ÅÌíà ??†ú???§Ìå®?àÏäµ?àÎã§.');
      }
    } catch (error) {
      console.error('?ÅÌíà ??†ú ?§Ìå®:', error);
      
      if (error.response?.status === 401) {
        alert('Î°úÍ∑∏?∏Ïù¥ ÎßåÎ£å?òÏóà?µÎãà?? ?§Ïãú Î°úÍ∑∏?∏Ìï¥Ï£ºÏÑ∏??');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/admin/login');
      } else if (error.response?.status === 403) {
        alert('?ÅÌíà ??†ú Í∂åÌïú???ÜÏäµ?àÎã§.');
      } else if (error.response?.status === 404) {
        alert('?ºÎ? ?ÅÌíà??Ï∞æÏùÑ ???ÜÏäµ?àÎã§. Î™©Î°ù???àÎ°úÍ≥†Ïπ®?©Îãà??');
        fetchProducts();
      } else if (error.code === 'ERR_NETWORK') {
        alert('?§Ìä∏?åÌÅ¨ ?§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§. ?úÎ≤ÑÍ∞Ä ?§Ìñâ Ï§ëÏù∏ÏßÄ ?ïÏù∏?¥Ï£º?∏Ïöî.');
      } else {
        alert('?ÅÌíà ??†ú Ï§??§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (productId, currentStatus) => {
    const newStatus = currentStatus === '?êÎß§Ï§? ? '?êÎß§Ï§ëÏ?' : '?êÎß§Ï§?;
    console.log(`[DEBUG] ?ÅÌÉú Î≥ÄÍ≤??úÎèÑ: ID=${productId}, ?ÑÏû¨=${currentStatus}, Î≥ÄÍ≤?${newStatus}`);
    
    try {
      const token = localStorage.getItem('accessToken');
      console.log("[DEBUG] ?†ÌÅ∞ ?†Î¨¥:", !!token);
      
      if (!token) {
        alert('Î°úÍ∑∏?∏Ïù¥ ?ÑÏöî?©Îãà??');
        navigate('/admin/login');
        return;
      }
      
      const response = await axios.patch(
        `${API_BASE_URL}/api/admin/products/${productId}/status`,
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log("[DEBUG] ?ÅÌÉú Î≥ÄÍ≤??ëÎãµ:", response.data);
      
      if (response.data && response.data.success) {
        // Î°úÏª¨ ?ÅÌÉú ?ÖÎç∞?¥Ìä∏
        setProducts(products.map(product => 
          product.id === productId ? { ...product, status: newStatus } : product
        ));
        alert(`?ÅÌíà ?ÅÌÉúÍ∞Ä '${newStatus}'(??Î°?Î≥ÄÍ≤ΩÎêò?àÏäµ?àÎã§.`);
      }
    } catch (error) {
      console.error('?ÅÌÉú Î≥ÄÍ≤??§Ìå®:', error);
      
      if (error.response?.status === 401) {
        alert('Î°úÍ∑∏?∏Ïù¥ ÎßåÎ£å?òÏóà?µÎãà?? ?§Ïãú Î°úÍ∑∏?∏Ìï¥Ï£ºÏÑ∏??');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/admin/login');
      } else {
        alert('?ÅÌÉú Î≥ÄÍ≤ΩÏóê ?§Ìå®?àÏäµ?àÎã§.');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case '?êÎß§Ï§?:
        return 'status-active';
      case '?àÏ†à':
        return 'status-outofstock';
      case '?êÎß§Ï§ëÏ?':
        return 'status-inactive';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return dateString;
    }
  };

  // Í≤Ä?âÏñ¥ ?ÑÌÑ∞Îß?
  const filteredProducts = searchTerm.trim() 
    ? products.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.productCode?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  return (
    <div className="admin-product-list">
      <AdminSidebar />
      
      <div className="product-list-main">
        <div className="page-header">
          <h1>Product List</h1>
          
          <div className="header-controls">
            <button className="add-btn" onClick={handleAddProduct}>
              + ?ÅÌíà ?±Î°ù
            </button>
          </div>
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner">Î°úÎî© Ï§?..</div>
          </div>
        )}

        <div className="filter-section">
          <div className="filters">
            <select 
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? '?ÑÏ≤¥ Ïπ¥ÌÖåÍ≥†Î¶¨' : category}
                </option>
              ))}
            </select>
            
            <select 
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? '?ÑÏ≤¥ ?ÅÌÉú' : status}
                </option>
              ))}
            </select>
          </div>
          
          <div className="search-box">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="?ÅÌíàÎ™??êÎäî ?ÅÌíàÏΩîÎìúÎ•??ÖÎ†•?òÏÑ∏??
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="search-btn">?îç</button>
            </form>
          </div>
        </div>

        <div className="product-table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    disabled={filteredProducts.length === 0}
                  />
                </th>
                <th>?ÅÌíàÏΩîÎìú</th>
                <th>?ÅÌíàÎ™?/th>
                <th>Ïπ¥ÌÖåÍ≥†Î¶¨</th>
                <th>?êÎß§Í∞ÄÍ≤?/th>
                <th>?¨Í≥†</th>
                <th>?ÅÌÉú</th>
                <th>?±Î°ù??/th>
                <th>Í¥ÄÎ¶?/th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={product.checked || false}
                        onChange={() => handleSelectProduct(product.id)}
                      />
                    </td>
                    <td className="product-code">{product.productCode || '-'}</td>
                    <td className="product-name">{product.name || '-'}</td>
                    <td>{product.category || '-'}</td>
                    <td className="price">
                      {product.price ? product.price.toLocaleString() + '?? : '-'}
                    </td>
                    <td className={`stock ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                      {product.stock !== undefined ? product.stock + 'Í∞? : '-'}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(product.status)}`}>
                        {product.status || '?êÎß§Ï§?}
                      </span>
                    </td>
                    <td>{formatDate(product.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="edit-btn" 
                          onClick={() => handleEditProduct(product.id)}
                        >
                          ?òÏ†ï
                        </button>
                        <button 
                          className="status-change-btn"
                          onClick={() => handleStatusChange(product.id, product.status)}
                        >
                          {product.status === '?êÎß§Ï§? ? 'Ï§ëÏ?' : '?¨Í∞ú'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">
                    {loading ? 'Î°úÎî© Ï§?..' : '?±Î°ù???ÅÌíà???ÜÏäµ?àÎã§.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <button 
            className="delete-btn" 
            onClick={handleDeleteSelected}
            disabled={loading || products.filter(p => p.checked).length === 0}
          >
            ?†ÌÉù ??†ú
          </button>
          
          <div className="product-summary">
            <span>Ï¥?{filteredProducts.length}Í∞??ÅÌíà</span>
            <span className="separator">|</span>
            <span>?êÎß§Ï§? {filteredProducts.filter(p => p.status === '?êÎß§Ï§?).length}Í∞?/span>
            <span className="separator">|</span>
            <span>?àÏ†à: {filteredProducts.filter(p => p.status === '?àÏ†à').length}Í∞?/span>
            <span className="separator">|</span>
            <span>Ï§ëÏ?: {filteredProducts.filter(p => p.status === '?êÎß§Ï§ëÏ?').length}Í∞?/span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;

