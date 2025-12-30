import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import apiClient from '../../api/axiosConfig';
import './ProductForm.css';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const [formData, setFormData] = useState({
    productCode: '',
    createdAt: '',
    name: '',
    category: '',
    subCategory: '',
    stock: '',
    thumbnailImage: null,
    detailImage: null,
    manufacturer: '',
    country: '',
    price: '',
    salePrice: '',
    additionalFeatures: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [detailPreview, setDetailPreview] = useState(null);
  
  // Ïπ¥ÌÖåÍ≥†Î¶¨ ?∞Ïù¥??state
  const [categories, setCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, [id]);

  // Ïπ¥ÌÖåÍ≥†Î¶¨ ?∞Ïù¥??Í∞Ä?∏Ïò§Í∏?
  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/api/admin/products/categories');
      setCategories(response.data);
      console.log('Ïπ¥ÌÖåÍ≥†Î¶¨ ?∞Ïù¥??Î°úÎìú ?±Í≥µ:', response.data);
    } catch (error) {
      console.error('Ïπ¥ÌÖåÍ≥†Î¶¨ Î°úÎìú ?§Ìå®:', error);
      alert('Ïπ¥ÌÖåÍ≥†Î¶¨ ?∞Ïù¥?∞Î? Î∂àÎü¨?§Îäî???§Ìå®?àÏäµ?àÎã§.');
    }
  };

  const fetchProductData = async () => {
    setFetchLoading(true);
    try {
      const response = await apiClient.get(`/api/admin/products/${id}`);
      const product = response.data;

      console.log('Fetched product:', product);

      // ?ÅÏÑ∏?§Ìéô ?åÏã±
      let specs = {};
      try {
        specs = product.description ? JSON.parse(product.description) : {};
      } catch (e) {
        console.error('Failed to parse description:', e);
      }

      setFormData({
        productCode: product.productCode || '',
        createdAt: product.createdAt || '',
        name: product.name || '',
        category: product.category || '',
        subCategory: product.subCategory || '',
        stock: product.stock || 0,
        manufacturer: product.manufacturer || '',
        country: product.country || '',
        price: product.price || 0,
        salePrice: product.salePrice || 0,
        additionalFeatures: specs.additionalFeatures || '',
        thumbnailImage: null,
        detailImage: null
      });

      // ?¥Î?ÏßÄ ÎØ∏Î¶¨Î≥¥Í∏∞ ?§Ï†ï
      if (product.thumbnailImage) {
        setThumbnailPreview(product.thumbnailImage);
      }
      if (product.detailImage) {
        setDetailPreview(product.detailImage);
      }

    } catch (error) {
      console.error('?ÅÌíà ?ïÎ≥¥ Ï°∞Ìöå ?§Ìå®:', error);
      alert('?ÅÌíà ?ïÎ≥¥Î•?Î∂àÎü¨?????ÜÏäµ?àÎã§.');
      navigate('/admin/products');
    } finally {
      setFetchLoading(false);
    }
  };

  // ?ÑÏû¨ ?ÅÌíà??Ïπ¥ÌÖåÍ≥†Î¶¨??ÎßûÎäî ?ÄÏπ¥ÌÖåÍ≥†Î¶¨ Ï∞æÍ∏∞
  useEffect(() => {
    if (formData.category && categories.length > 0) {
      const mainCat = categories.find(cat => 
        cat.subCategories.includes(formData.category)
      );
      if (mainCat) {
        setSelectedMainCategory(mainCat.parentCategory);
      }
    }
  }, [formData.category, categories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ?ÄÏπ¥ÌÖåÍ≥†Î¶¨ ?†ÌÉù ?∏Îì§??
  const handleMainCategoryChange = (e) => {
    const mainCategoryValue = e.target.value;
    setSelectedMainCategory(mainCategoryValue);
    setFormData(prev => ({
      ...prev,
      category: '' // ?åÏπ¥?åÍ≥†Î¶?Ï¥àÍ∏∞??
    }));
  };

  // ?åÏπ¥?åÍ≥†Î¶??†ÌÉù ?∏Îì§??
  const handleSubCategoryChange = (e) => {
    const subCategoryValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      category: subCategoryValue
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [type]: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'thumbnailImage') {
          setThumbnailPreview(reader.result);
        } else {
          setDetailPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: null
    }));
    if (type === 'thumbnailImage') {
      setThumbnailPreview(null);
    } else {
      setDetailPreview(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16).replace('T', ' ');
    } catch {
      return dateString;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price) {
      alert('?ÅÌíàÎ™? Ïπ¥ÌÖåÍ≥†Î¶¨, ?ïÏÉÅÍ∞ÄÍ≤©Ï? ?ÑÏàò ?ÖÎ†• ??™©?ÖÎãà??');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      submitData.append('name', formData.name);
      submitData.append('category', formData.category);
      submitData.append('productCode', formData.productCode || '');
      submitData.append('manufacturer', formData.manufacturer || '');
      submitData.append('country', formData.country || '');
      submitData.append('price', formData.price || 0);
      submitData.append('salePrice', formData.salePrice || formData.price);
      submitData.append('stock', formData.stock || 0);
      submitData.append('description', formData.additionalFeatures || '');

      // ?åÏùº???§Ï†ú File Í∞ùÏ≤¥???åÎßå Ï∂îÍ?
      if (formData.thumbnailImage instanceof File) {
        submitData.append('thumbnailImage', formData.thumbnailImage);
        console.log('Uploading new thumbnail image');
      }
      if (formData.detailImage instanceof File) {
        submitData.append('detailImage', formData.detailImage);
        console.log('Uploading new detail image');
      }

      console.log('Updating product data...');
      
      // FormData ?¥Ïö© Î°úÍπÖ
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await apiClient.put(
        `/api/admin/products/${id}`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Product updated:', response.data);
      
      if (response.data && response.data.success) {
        alert('?ÅÌíà???òÏ†ï?òÏóà?µÎãà??');
        navigate('/admin/products');
      } else {
        alert(response.data.message || '?ÅÌíà ?òÏ†ï???§Ìå®?àÏäµ?àÎã§.');
      }

    } catch (error) {
      console.error('?ÅÌíà ?òÏ†ï ?§Ìå®:', error);
      
      if (error.response?.data?.message) {
        alert(`?ÅÌíà ?òÏ†ï ?§Ìå®: ${error.response.data.message}`);
      } else {
        alert('?ÅÌíà ?òÏ†ï Ï§??§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('?òÏ†ï Ï§ëÏù∏ ?¥Ïö©????†ú?©Îãà?? Ï∑®ÏÜå?òÏãúÍ≤†Ïäµ?àÍπå?')) {
      navigate('/admin/products');
    }
  };

  // ?ÑÏû¨ ?†ÌÉù???ÄÏπ¥ÌÖåÍ≥†Î¶¨???åÏπ¥?åÍ≥†Î¶?Î™©Î°ù Í∞Ä?∏Ïò§Í∏?
  const getCurrentSubCategories = () => {
    if (!selectedMainCategory) return [];
    const mainCat = categories.find(cat => cat.parentCategory === selectedMainCategory);
    return mainCat ? mainCat.subCategories : [];
  };

  if (fetchLoading) {
    return (
      <div className="admin-product-form">
        <AdminSidebar />
        <div className="product-form-main">
          <div className="loading-overlay">
            <div className="loading-spinner">Î°úÎî© Ï§?..</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-product-form">
      <AdminSidebar />
      
      <div className="product-form-main">
        <h1>Product Edit</h1>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner">?òÏ†ï Ï§?..</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <table className="form-table">
              <tbody>
                <tr>
                  <th>?ÅÌíàÏΩîÎìú</th>
                  <td>
                    <input
                      type="text"
                      value={formData.productCode}
                      readOnly
                      className="readonly-input"
                    />
                  </td>
                </tr>
                <tr>
                  <th>?±Î°ù?ºÏûê</th>
                  <td>
                    <input
                      type="text"
                      value={formatDate(formData.createdAt)}
                      readOnly
                      className="readonly-input"
                    />
                  </td>
                </tr>
                <tr>
                  <th>?ÅÌíàÎ™?/th>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="?ÅÌíàÎ™ÖÏùÑ ?ÖÎ†•?òÏÑ∏??
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th>Ïπ¥ÌÖåÍ≥†Î¶¨</th>
                  <td>
                    <div className="category-select">
                      <select
                        value={selectedMainCategory || ''}
                        onChange={handleMainCategoryChange}
                        required
                      >
                        <option value="">?†ÌÉù1</option>
                        {categories.map(cat => (
                          <option key={cat.parentCategory} value={cat.parentCategory}>
                            {cat.parentCategoryName}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.category}
                        onChange={handleSubCategoryChange}
                        disabled={!selectedMainCategory}
                        required
                      >
                        <option value="">?†ÌÉù2</option>
                        {getCurrentSubCategories().map(subCat => (
                          <option key={subCat} value={subCat}>{subCat}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>?úÍ≥†?òÎüâ</th>
                  <td>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="?¨Í≥† ?òÎüâ"
                      min="0"
                    />
                  </td>
                </tr>
                <tr>
                  <th>Î™©Î°ù?¥Î?ÏßÄ</th>
                  <td>
                    <div className="file-upload-container">
                      <label className="file-upload-btn">
                        ?åÏùºÏ≤®Î?
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'thumbnailImage')}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {thumbnailPreview && (
                        <div className="file-preview">
                          {formData.thumbnailImage instanceof File ? (
                            <img src={thumbnailPreview} alt="Thumbnail" />
                          ) : (
                            <span className="file-name">{thumbnailPreview.split('/').pop()}</span>
                          )}
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={() => handleRemoveFile('thumbnailImage')}
                          >
                            √ó
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>?ÅÏÑ∏?òÏù¥ÏßÄ</th>
                  <td>
                    <div className="file-upload-container">
                      <label className="file-upload-btn">
                        ?åÏùºÏ≤®Î?
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'detailImage')}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {detailPreview && (
                        <div className="file-preview">
                          {formData.detailImage instanceof File ? (
                            <img src={detailPreview} alt="Detail" />
                          ) : (
                            <span className="file-name">{detailPreview.split('/').pop()}</span>
                          )}
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={() => handleRemoveFile('detailImage')}
                          >
                            √ó
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>?úÏ°∞??/th>
                  <td>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      placeholder="?úÏ°∞??
                    />
                  </td>
                </tr>
                <tr>
                  <th>?úÏ°∞Íµ?/th>
                  <td>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="?úÏ°∞Íµ?
                    />
                  </td>
                </tr>
                <tr>
                  <th>?ïÏÉÅÍ∞ÄÍ≤?/th>
                  <td>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="?ïÏÉÅÍ∞ÄÍ≤?
                      required
                      min="0"
                    />
                  </td>
                </tr>
                <tr>
                  <th>?†Ïù∏Í∞ÄÍ≤?/th>
                  <td>
                    <input
                      type="number"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleInputChange}
                      placeholder="?†Ïù∏Í∞ÄÍ≤?
                      min="0"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="form-buttons">
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Î™©Î°ù
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                ?±Î°ù
              </button>
            </div>
          </div>

          <div className="form-section">
            <h2>?ÅÏÑ∏?§Ìéô</h2>
            <table className="form-table">
              <tbody>
                <tr>
                  <th>Ï∂îÍ??ÅÌíà</th>
                  <td>
                    <input
                      type="text"
                      name="additionalFeatures"
                      value={formData.additionalFeatures}
                      onChange={handleInputChange}
                      placeholder="Ï∂îÍ??ÅÌíà"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="form-buttons">
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Î™©Î°ù
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                ?òÏ†ï
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;

