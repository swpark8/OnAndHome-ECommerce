import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import apiClient from '../../api/axiosConfig';
import './ProductForm.css';

const ProductCreate = () => {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subCategory: '',
    productCode: '',
    manufacturer: '',
    country: '',
    price: '',
    salePrice: '',
    stock: '',
    thumbnailImage: null,
    detailImage: null,
    size: '',
    weight: '',
    power: '',
    material: '',
    additionalFeatures: '',
    productCode2: ''
  });

  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [detailPreview, setDetailPreview] = useState(null);

  // Ïπ¥ÌÖåÍ≥†Î¶¨ ?∞Ïù¥??state
  const [categories, setCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  // Ïπ¥ÌÖåÍ≥†Î¶¨ ?∞Ïù¥??Í∞Ä?∏Ïò§Í∏?
  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/api/admin/products/categories');
      setCategories(response.data);
      console.log('Ïπ¥ÌÖåÍ≥†Î¶¨ ?∞Ïù¥??Î°úÎìú ?±Í≥µ:', response.data);
    } catch (error) {
      console.error('Ïπ¥ÌÖåÍ≥†Î¶¨ Î°úÎìú ?§Ìå®:', error);
      
      if (error.response?.status === 401) {
        alert('Î°úÍ∑∏?∏Ïù¥ ?ÑÏöî?©Îãà??');
        navigate('/admin/login');
      } else {
        alert('Ïπ¥ÌÖåÍ≥†Î¶¨ ?∞Ïù¥?∞Î? Î∂àÎü¨?§Îäî???§Ìå®?àÏäµ?àÎã§.');
      }
    }
  };

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

  // ?ÑÏû¨ ?†ÌÉù???ÄÏπ¥ÌÖåÍ≥†Î¶¨???åÏπ¥?åÍ≥†Î¶?Î™©Î°ù Í∞Ä?∏Ïò§Í∏?
  const getCurrentSubCategories = () => {
    if (!selectedMainCategory) return [];
    const mainCat = categories.find(cat => cat.parentCategory === selectedMainCategory);
    return mainCat ? mainCat.subCategories : [];
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price) {
      alert('?ÅÌíàÎ™? Ïπ¥ÌÖåÍ≥†Î¶¨, ?ïÏÉÅÍ∞ÄÍ≤©Ï? ?ÑÏàò ?ÖÎ†• ??™©?ÖÎãà??');
      return;
    }

    // JWT ?†ÌÅ∞ ?ïÏù∏
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      alert('Î°úÍ∑∏?∏Ïù¥ ?ÑÏöî?©Îãà?? ?§Ïãú Î°úÍ∑∏?∏Ìï¥Ï£ºÏÑ∏??');
      navigate('/admin/login');
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
      
      // ?ÅÏÑ∏?§Ìéô??Î¨∏Ïûê?¥Î°ú ?Ä??
      const specs = [
        formData.size && `?¨Í∏∞: ${formData.size}`,
        formData.weight && `Î¨¥Í≤å: ${formData.weight}`,
        formData.power && `?ÑÏïï: ${formData.power}`,
        formData.material && `?¨Ïßà: ${formData.material}`,
        formData.additionalFeatures && `Ï∂îÍ??ÅÌíà: ${formData.additionalFeatures}`
      ].filter(Boolean).join(', ');
      
      submitData.append('description', specs);

      if (formData.thumbnailImage) {
        submitData.append('thumbnailImage', formData.thumbnailImage);
        console.log('Uploading thumbnail image');
      }
      if (formData.detailImage) {
        submitData.append('detailImage', formData.detailImage);
        console.log('Uploading detail image');
      }

      console.log('Submitting product data...');
      
      // FormData ?¥Ïö© Î°úÍπÖ
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await apiClient.post(
        '/api/admin/products',
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      console.log('Product created:', response.data);
      
      if (response.data && response.data.success) {
        alert('?ÅÌíà???±Î°ù?òÏóà?µÎãà??');
        navigate('/admin/products');
      } else {
        alert(response.data.message || '?ÅÌíà ?±Î°ù???§Ìå®?àÏäµ?àÎã§.');
      }

    } catch (error) {
      console.error('?ÅÌíà ?±Î°ù ?§Ìå®:', error);
      
      if (error.response?.status === 401) {
        alert('Î°úÍ∑∏?∏Ïù¥ ÎßåÎ£å?òÏóà?µÎãà?? ?§Ïãú Î°úÍ∑∏?∏Ìï¥Ï£ºÏÑ∏??');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/admin/login');
      } else if (error.response?.data?.message) {
        alert(`?ÅÌíà ?±Î°ù ?§Ìå®: ${error.response.data.message}`);
      } else {
        alert('?ÅÌíà ?±Î°ù Ï§??§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('?ëÏÑ± Ï§ëÏù∏ ?¥Ïö©????†ú?©Îãà?? Ï∑®ÏÜå?òÏãúÍ≤†Ïäµ?àÍπå?')) {
      navigate('/admin/products');
    }
  };

  return (
    <div className="admin-product-form">
      <AdminSidebar />
      
      <div className="product-form-main">
        <h1>Product Create</h1>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner">?±Î°ù Ï§?..</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <table className="form-table">
              <tbody>
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
                        value={selectedMainCategory}
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
                          <img src={thumbnailPreview} alt="Thumbnail" />
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
                          <img src={detailPreview} alt="Detail" />
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
                  <th>?¨Í∏∞</th>
                  <td>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      placeholder="?¨Í∏∞"
                    />
                  </td>
                </tr>
                <tr>
                  <th>Î¨¥Í≤å</th>
                  <td>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="Î¨¥Í≤å"
                    />
                  </td>
                </tr>
                <tr>
                  <th>?ÑÏïï</th>
                  <td>
                    <input
                      type="text"
                      name="power"
                      value={formData.power}
                      onChange={handleInputChange}
                      placeholder="?ÑÏïï"
                    />
                  </td>
                </tr>
                <tr>
                  <th>?¨Ïßà</th>
                  <td>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      placeholder="?¨Ïßà"
                    />
                  </td>
                </tr>
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
                <tr>
                  <th>?úÍ≥†?òÎüâ</th>
                  <td>
                    <input
                      type="text"
                      name="productCode2"
                      value={formData.productCode2}
                      onChange={handleInputChange}
                      placeholder="?ÅÌíàÏΩîÎìú"
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
        </form>
      </div>
    </div>
  );
};

export default ProductCreate;

