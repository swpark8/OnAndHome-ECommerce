import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import noticeApi from '../../api/noticeApi';
import './NoticeDetail.css';

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNoticeDetail();
  }, [id]);

  const fetchNoticeDetail = async () => {
    setLoading(true);
    try {
      const data = await noticeApi.getNoticeDetail(id);
      setNotice(data);
    } catch (error) {
      console.error('Í≥µÏ??¨Ìï≠ Î°úÎìú ?§Ìå®:', error);
      alert('Í≥µÏ??¨Ìï≠??Î∂àÎü¨?§Îäî???§Ìå®?àÏäµ?àÎã§.');
      navigate('/admin/notices');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/notices/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('?ïÎßê ??†ú?òÏãúÍ≤†Ïäµ?àÍπå?')) {
      return;
    }

    try {
      await noticeApi.deleteNotice(id);
      alert('??†ú?òÏóà?µÎãà??');
      navigate('/admin/notices');
    } catch (error) {
      console.error('??†ú ?§Ìå®:', error);
      alert('??†ú???§Ìå®?àÏäµ?àÎã§.');
    }
  };

  const handleList = () => {
    navigate('/admin/notices');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="dashboard-main">
          <div className="loading">Î°úÎî© Ï§?..</div>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="dashboard-main">
          <div className="error-message">Í≥µÏ??¨Ìï≠??Ï∞æÏùÑ ???ÜÏäµ?àÎã§.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <div className="dashboard-main">
        <div className="notice-detail-container">
          <div className="notice-detail-header">
            <h1>Í≥µÏ??¨Ìï≠ ?ÅÏÑ∏</h1>
          </div>

          <div className="notice-detail-card">
            {/* ?§Îçî */}
            <div className="detail-header">
              <div className="title-section">
                <h2 className="detail-title">{notice.title}</h2>
              </div>
              
              <div className="meta-info">
                <div className="meta-item">
                  <span className="meta-label">?ëÏÑ±??/span>
                  <span className="meta-value">{notice.writer || 'Í¥ÄÎ¶¨Ïûê'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">?ëÏÑ±??/span>
                  <span className="meta-value">{formatDate(notice.createdAt)}</span>
                </div>
                {notice.updatedAt && (
                  <div className="meta-item">
                    <span className="meta-label">?òÏ†ï??/span>
                    <span className="meta-value">{formatDate(notice.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ?¥Ïö© */}
            <div className="detail-content">
              <div className="content-body">
                {notice.content.split('\n').map((line, index) => (
                  <p key={index}>{line || '\u00A0'}</p>
                ))}
              </div>
            </div>

            {/* ?°ÏÖò Î≤ÑÌäº */}
            <div className="detail-actions">
              <button className="btn-list" onClick={handleList}>
                Î™©Î°ù
              </button>
              <div className="action-group">
                <button className="btn-edit" onClick={handleEdit}>
                  ?òÏ†ï
                </button>
                <button className="btn-delete" onClick={handleDelete}>
                  ??†ú
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;

