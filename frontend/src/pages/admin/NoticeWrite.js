import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import noticeApi from '../../api/noticeApi';
import './NoticeWrite.css';

const NoticeWrite = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    writer: 'ê´€ë¦¬ì'
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('?œëª©???…ë ¥?´ì£¼?¸ìš”.');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('?´ìš©???…ë ¥?´ì£¼?¸ìš”.');
      return;
    }

    setLoading(true);
    try {
      await noticeApi.createNotice(formData);
      alert('ê³µì??¬í•­???±ë¡?˜ì—ˆ?µë‹ˆ??');
      navigate('/admin/notices');
    } catch (error) {
      console.error('ê³µì??¬í•­ ?±ë¡ ?¤íŒ¨:', error);
      alert('ê³µì??¬í•­ ?±ë¡???¤íŒ¨?ˆìŠµ?ˆë‹¤.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('?‘ì„±??ì·¨ì†Œ?˜ì‹œê² ìŠµ?ˆê¹Œ? ?‘ì„± ì¤‘ì¸ ?´ìš©?€ ?€?¥ë˜ì§€ ?ŠìŠµ?ˆë‹¤.')) {
      navigate('/admin/notices');
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <div className="dashboard-main">
        <div className="notice-write-container">
          <div className="notice-write-header">
            <h1>ê³µì??¬í•­ ?‘ì„±</h1>
            <p className="notice-description">?ˆë¡œ??ê³µì??¬í•­???‘ì„±?©ë‹ˆ??/p>
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
                  onChange={handleInputChange}
                  placeholder="ê³µì??¬í•­ ?œëª©???…ë ¥?˜ì„¸??
                  className="form-input"
                  maxLength={100}
                />
                <div className="char-count">
                  {formData.title.length} / 100
                </div>
              </div>

              <div className="form-section">
                <label className="form-label required">
                  ?‘ì„±??
                </label>
                <input
                  type="text"
                  name="writer"
                  value={formData.writer}
                  onChange={handleInputChange}
                  placeholder="?‘ì„±?ëª…???…ë ¥?˜ì„¸??
                  className="form-input"
                  maxLength={50}
                />
              </div>

              <div className="form-section">
                <label className="form-label required">
                  ?´ìš©
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="ê³µì??¬í•­ ?´ìš©???…ë ¥?˜ì„¸??
                  className="form-textarea"
                  rows={15}
                />
                <div className="char-count">
                  {formData.content.length}??
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-cancel"
              >
                ì·¨ì†Œ
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? '?±ë¡ ì¤?..' : '?±ë¡?˜ê¸°'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoticeWrite;

