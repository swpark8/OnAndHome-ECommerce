import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import axios from 'axios';
import './ReviewList.css';

const ReviewList = () => {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/reviews`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      console.log('Î¶¨Î∑∞ Î™©Î°ù ?ëÎãµ:', response.data);

      if (response.data && Array.isArray(response.data)) {
        const reviewsWithCheck = response.data.map(review => ({
          ...review,
          checked: false
        }));
        setReviews(reviewsWithCheck);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Î¶¨Î∑∞ Î™©Î°ù Ï°∞Ìöå ?§Ìå®:', error);
      alert('Î¶¨Î∑∞ Î™©Î°ù??Î∂àÎü¨?§Îäî???§Ìå®?àÏäµ?àÎã§.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setReviews(reviews.map(review => ({ ...review, checked })));
  };

  const handleSelectReview = (reviewId) => {
    const updatedReviews = reviews.map(review =>
      review.id === reviewId ? { ...review, checked: !review.checked } : review
    );
    setReviews(updatedReviews);

    const allChecked = updatedReviews.every(review => review.checked);
    setSelectAll(allChecked);
  };

  const handleSearch = () => {
    // Í≤Ä??Í∏∞Îä•?Ä ?ÑÌÑ∞ÎßÅÏúºÎ°?Íµ¨ÌòÑ
    fetchReviews();
  };

  const handleDeleteSelected = async () => {
    const selectedReviews = reviews.filter(review => review.checked);

    if (selectedReviews.length === 0) {
      alert('??†ú??Î¶¨Î∑∞Î•??†ÌÉù?¥Ï£º?∏Ïöî.');
      return;
    }

    if (!window.confirm(`?†ÌÉù??${selectedReviews.length}Í∞úÏùò Î¶¨Î∑∞Î•???†ú?òÏãúÍ≤†Ïäµ?àÍπå?\n\n???ëÏóÖ?Ä ?òÎèåÎ¶????ÜÏäµ?àÎã§.`)) {
      return;
    }

    setLoading(true);

    try {
      const reviewIds = selectedReviews.map(review => review.id);

      const response = await axios.post(
        `${API_BASE_URL}/api/admin/reviews/delete`,
        { ids: reviewIds },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (response.data && response.data.success) {
        alert(response.data.message || `${selectedReviews.length}Í∞úÏùò Î¶¨Î∑∞Í∞Ä ??†ú?òÏóà?µÎãà??`);
        await fetchReviews();
        setSelectAll(false);
      } else {
        alert(response.data.message || 'Î¶¨Î∑∞ ??†ú???§Ìå®?àÏäµ?àÎã§.');
      }
    } catch (error) {
      console.error('Î¶¨Î∑∞ ??†ú ?§Ìå®:', error);
      alert('Î¶¨Î∑∞ ??†ú Ï§??§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§.');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (reviewId) => {
    navigate(`/admin/reviews/${reviewId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';

    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          ??
        </span>
      );
    }
    return <div className="rating-stars">{stars}</div>;
  };

  // Í≤Ä?âÏñ¥ ?ÑÌÑ∞Îß?
  const filteredReviews = reviews.filter(review => {
    if (!searchKeyword.trim()) return true;

    const keyword = searchKeyword.toLowerCase();
    return (
      review.content?.toLowerCase().includes(keyword) ||
      review.author?.toLowerCase().includes(keyword) ||
      review.productName?.toLowerCase().includes(keyword)
    );
  });

  // ?òÏù¥ÏßÄ?§Ïù¥??
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="admin-review-list">
        <AdminSidebar />
        <div className="review-list-main">
          <div className="loading">Î°úÎî© Ï§?..</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-review-list">
      <AdminSidebar />

      <div className="review-list-main">
        <div className="page-header">
          <h1>Î¶¨Î∑∞ Í¥ÄÎ¶?/h1>

          <div className="search-box">
            <input
              type="text"
              placeholder="?ÅÌíàÎ™? ?ëÏÑ±?? ?¥Ïö©???ÖÎ†•?òÏÑ∏??
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="search-btn">
              ?îç
            </button>
          </div>
        </div>

        {/* Î¶¨Î∑∞ Î™©Î°ù ?åÏù¥Î∏?*/}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    disabled={currentItems.length === 0}
                  />
                </th>
                <th style={{ width: '80px' }}>Î≤àÌò∏</th>
                <th style={{ width: '200px' }}>?ÅÌíàÎ™?/th>
                <th>?¥Ïö©</th>
                <th style={{ width: '120px' }}>?âÏ†ê</th>
                <th style={{ width: '120px' }}>?ëÏÑ±??/th>
                <th style={{ width: '150px' }}>?ëÏÑ±?ºÏûê</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    Î¶¨Î∑∞Í∞Ä ?ÜÏäµ?àÎã§.
                  </td>
                </tr>
              ) : (
                currentItems.map((review, index) => (
                  <tr 
                    key={review.id}
                    onClick={() => handleRowClick(review.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={review.checked || false}
                        onChange={() => handleSelectReview(review.id)}
                      />
                    </td>
                    <td>{filteredReviews.length - (indexOfFirstItem + index)}</td>
                    <td className="text-left">{review.productName || '-'}</td>
                    <td className="text-left content-preview">
                      {review.content?.length > 50
                        ? review.content.substring(0, 50) + '...'
                        : review.content}
                    </td>
                    <td>{renderStars(review.rating)}</td>
                    <td>{review.author || '-'}</td>
                    <td>{formatDate(review.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ?åÏù¥Î∏??òÎã® */}
        <div className="table-footer">
          <button
            className="delete-btn"
            onClick={handleDeleteSelected}
            disabled={loading || reviews.filter(r => r.checked).length === 0}
          >
            ??†ú
          </button>

          {/* ?òÏù¥ÏßÄ?§Ïù¥??*/}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-button"
              >
                ?¥Ï†Ñ
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-button"
              >
                ?§Ïùå
              </button>
            </div>
          )}
        </div>

        {/* ?µÍ≥Ñ ?ïÎ≥¥ */}
        <div className="review-stats">
          <p>?ÑÏ≤¥ Î¶¨Î∑∞: {filteredReviews.length}Í∞?/p>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;

