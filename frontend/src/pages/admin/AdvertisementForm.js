import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import advertisementApi from '../../api/advertisementApi';
import toast from 'react-hot-toast';
import './AdvertisementForm.css';

const AdvertisementForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    linkUrl: '',
    active: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchAdvertisement();
    }
  }, [id]);

  const fetchAdvertisement = async () => {
    try {
      const response = await advertisementApi.getById(id);
      if (response.success) {
        setFormData(response.advertisement);
      }
    } catch (error) {
      console.error('ê´‘ê³  ì¡°íšŒ ?¤íŒ¨:', error);
      toast.error('ê´‘ê³  ?•ë³´ë¥?ë¶ˆëŸ¬?¤ëŠ”???¤íŒ¨?ˆìŠµ?ˆë‹¤.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('?œëª©???…ë ¥?´ì£¼?¸ìš”.');
      return false;
    }
    if (!formData.content.trim()) {
      toast.error('?´ìš©???…ë ¥?´ì£¼?¸ìš”.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      let response;

      if (isEditMode) {
        response = await advertisementApi.update(id, formData);
      } else {
        response = await advertisementApi.create(formData);
      }

      if (response.success) {
        toast.success(response.message);
        navigate('/admin/advertisements');
      }
    } catch (error) {
      console.error('ê´‘ê³  ?€???¤íŒ¨:', error);
      toast.error(error.response?.data?.message || 'ê´‘ê³  ?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('?‘ì„±??ì·¨ì†Œ?˜ì‹œê² ìŠµ?ˆê¹Œ? ?‘ì„± ì¤‘ì¸ ?´ìš©?€ ?€?¥ë˜ì§€ ?ŠìŠµ?ˆë‹¤.')) {
      navigate('/admin/advertisements');
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <div className="dashboard-main">
        <div className="notice-write-container">
          <div className="notice-write-header">
            <h1>{isEditMode ? 'ê´‘ê³  ?˜ì •' : 'ê´‘ê³  ?‘ì„±'}</h1>
            <p className="notice-description">
              {isEditMode ? 'ê´‘ê³  ?•ë³´ë¥??˜ì •?©ë‹ˆ?? : '?ˆë¡œ??ê´‘ê³ ë¥??‘ì„±?©ë‹ˆ??}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="notice-write-form">
            <div className="form-card">
              <div className="form-section">
                <label className="form-label required">
                  ?œëª©
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="ê´‘ê³  ?œëª©???…ë ¥?˜ì„¸??
                  className="form-input"
                  maxLength={200}
                  disabled={loading}
                />
                <span className="char-count">{formData.title.length} / 200</span>
              </div>

              <div className="form-section">
                <label className="form-label required">
                  ?´ìš©
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="ê´‘ê³  ?´ìš©???…ë ¥?˜ì„¸??
                  className="form-textarea"
                  rows={8}
                  maxLength={2000}
                  disabled={loading}
                />
                <span className="char-count">{formData.content.length} / 2000</span>
              </div>

              <div className="form-section">
                <label className="form-label">
                  ?´ë?ì§€ URL
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="?´ë?ì§€ URL???…ë ¥?˜ì„¸??(? íƒ?¬í•­)"
                  className="form-input"
                  disabled={loading}
                />
                <span className="form-hint">ê´‘ê³ ???¬ìš©???´ë?ì§€??URL???…ë ¥?˜ì„¸??/span>
              </div>

              <div className="form-section">
                <label className="form-label">
                  ë§í¬ URL
                </label>
                <input
                  type="text"
                  name="linkUrl"
                  value={formData.linkUrl}
                  onChange={handleChange}
                  placeholder="ë§í¬ URL???…ë ¥?˜ì„¸??(? íƒ?¬í•­)"
                  className="form-input"
                  disabled={loading}
                />
                <span className="form-hint">?´ë¦­ ???´ë™???˜ì´ì§€ URL???…ë ¥?˜ì„¸??/span>
              </div>

              <div className="form-section">
                <div className="checkbox-wrapper">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span className="checkbox-text">?œì„± ?íƒœ</span>
                  </label>
                  <span className="form-hint">
                    ë¹„í™œ???íƒœë¡??€?¥í•˜ë©??Œë¦¼ ë°œì†¡???????†ìŠµ?ˆë‹¤
                  </span>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-cancel"
                  disabled={loading}
                >
                  ì·¨ì†Œ
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'ì²˜ë¦¬ì¤?..' : isEditMode ? '?˜ì •' : '?±ë¡'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementForm;

