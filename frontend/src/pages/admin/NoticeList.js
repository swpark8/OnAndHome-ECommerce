import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import noticeApi from '../../api/noticeApi';
import './NoticeList.css';

const NoticeList = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const data = await noticeApi.getAllNotices();
      // ?†Ïßú Í∏∞Ï? ?¥Î¶ºÏ∞®Ïàú ?ïÎ†¨
      const sortedData = data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotices(sortedData);
    } catch (error) {
      console.error('Í≥µÏ??¨Ìï≠ Î°úÎìú ?§Ìå®:', error);
      alert('Í≥µÏ??¨Ìï≠??Î∂àÎü¨?§Îäî???§Ìå®?àÏäµ?àÎã§.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (notice.writer && notice.writer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotices = filteredNotices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleWriteClick = () => {
    navigate('/admin/notices/write');
  };

  const handleNoticeClick = (id) => {
    navigate(`/admin/notices/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('?ïÎßê ??†ú?òÏãúÍ≤†Ïäµ?àÍπå?')) {
      try {
        await noticeApi.deleteNotice(id);
        alert('??†ú?òÏóà?µÎãà??');
        fetchNotices(); // Î™©Î°ù ?àÎ°úÍ≥†Ïπ®
      } catch (error) {
        console.error('??†ú ?§Ìå®:', error);
        alert('??†ú???§Ìå®?àÏäµ?àÎã§.');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '-').replace('.', '');
  };

  return (
    <div className="admin-notice-list">
      <AdminSidebar />
      
      <div className="notice-list-main">
        <div className="notice-container">
          <div className="notice-header">
            <h1>Í≥µÏ??¨Ìï≠ Í¥ÄÎ¶?/h1>
            <p className="notice-description">?¨Ïö©?êÏóêÍ≤??úÏãú??Í≥µÏ??¨Ìï≠??Í¥ÄÎ¶¨Ìï©?àÎã§</p>
          </div>

          <div className="notice-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="?úÎ™© ?êÎäî ?ëÏÑ±?êÎ°ú Í≤Ä??
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <span className="search-icon">?îç</span>
            </div>
            <button className="btn-write" onClick={handleWriteClick}>
              <span className="btn-icon">?èÔ∏è</span>
              Í≥µÏ??¨Ìï≠ ?ëÏÑ±
            </button>
          </div>

          <div className="notice-stats">
            <span className="total-count">?ÑÏ≤¥ {filteredNotices.length}Í±?/span>
          </div>

          {loading ? (
            <div className="loading">Î°úÎî© Ï§?..</div>
          ) : (
            <>
              <div className="notice-table-wrapper">
                <table className="notice-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Î≤àÌò∏</th>
                      <th style={{ width: 'auto' }}>?úÎ™©</th>
                      <th style={{ width: '120px' }}>?ëÏÑ±??/th>
                      <th style={{ width: '120px' }}>?ëÏÑ±??/th>
                      <th style={{ width: '150px' }}>Í¥ÄÎ¶?/th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentNotices.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="no-data">
                          ?±Î°ù??Í≥µÏ??¨Ìï≠???ÜÏäµ?àÎã§.
                        </td>
                      </tr>
                    ) : (
                      currentNotices.map((notice, index) => (
                        <tr key={notice.id}>
                          <td>{indexOfFirstItem + index + 1}</td>
                          <td className="title-cell">
                            <span
                              className="notice-title"
                              onClick={() => handleNoticeClick(notice.id)}
                            >
                              {notice.title}
                            </span>
                          </td>
                          <td>{notice.writer || 'Í¥ÄÎ¶¨Ïûê'}</td>
                          <td>{formatDate(notice.createdAt)}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-edit"
                                onClick={() => navigate(`/admin/notices/edit/${notice.id}`)}
                              >
                                ?òÏ†ï
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() => handleDelete(notice.id)}
                              >
                                ??†ú
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ?¥Ï†Ñ
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    className="page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    ?§Ïùå
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeList;

