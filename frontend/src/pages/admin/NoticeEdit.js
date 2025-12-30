import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import noticeApi from '../../api/noticeApi';
import './NoticeWrite.css';

const NoticeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    writer: 'ê´€ë¦¬ì'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNoticeDetail();
  }, [id]);

  const fetchNoticeDetail = async () => {
    setLoading(true);
    try {
      const data = await noticeApi.getNoticeDetail(id);
      setFormData({
        title: data.title,
        content: data.content,
        writer: data.writer || 'ê´€ë¦¬ì'
      });
    } catch (error) {
      console.error('ê³µì??¬í•­ ë¡œë“œ ?¤íŒ¨:', error);
      alert('ê³µì??¬í•­??ë¶ˆëŸ¬?¤ëŠ”???¤íŒ¨?ˆìŠµ?ˆë‹¤.');
      navigate('/admin/notices');
    } finally {
      setLoading(false);
    }
  };

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

    setSubmitting(true);
    try {
      await noticeApi.updateNotice(id, formData);
      alert('ê³µì??¬í•­???˜ì •?˜ì—ˆ?µë‹ˆ??');
      navigate(`/admin/notices/${id}`);
    } catch (error) {
      console.error('ê³µì??¬í•­ ?˜ì • ?¤íŒ¨:', error);
      alert('ê³µì??¬í•­ ?˜ì •???¤íŒ¨?ˆìŠµ?ˆë‹¤.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('?˜ì •??ì·¨ì†Œ?˜ì‹œê² ìŠµ?ˆê¹Œ? ë³€ê²½ì‚¬??? ?€?¥ë˜ì§€ ?ŠìŠµ?ˆë‹¤.')) {
      navigate(`/admin/notices/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="dashboard-main">
          <div className="loading">ë¡œë”© ì¤?..</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <div className="dashboard-main">
        <div className="notice-write-container">
          <div className="notice-write-header">
            <h1>ê³µì??¬í•­ ?˜ì •</h1>
            <p className="notice-description">ê³µì??¬í•­???˜ì •?©ë‹ˆ??/p>
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
                disabled={submitting}
              >
                {submitting ? '?˜ì • ì¤?..' : '?˜ì •?˜ê¸°'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoticeEdit;

