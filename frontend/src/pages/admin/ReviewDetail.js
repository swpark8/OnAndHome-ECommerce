import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";
import "./ReviewDetail.css";

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  const [review, setReview] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  // ?òÏ†ï ?ÅÌÉú
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  // ?±Î°ù ?ÅÌÉú
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviewDetail();
  }, [id]);

  const fetchReviewDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/reviews/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setReview(response.data.review);
        setReplies(response.data.replies || []);
      }
    } catch (error) {
      alert("Î¶¨Î∑∞ ?ïÎ≥¥Î•?Î∂àÎü¨?§Îäî???§Ìå®?àÏäµ?àÎã§.");
      navigate("/admin/reviews");
    } finally {
      setLoading(false);
    }
  };

  // ?µÎ? ?±Î°ù
  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      alert("?µÎ? ?¥Ïö©???ÖÎ†•?¥Ï£º?∏Ïöî.");
      return;
    }

    if (!window.confirm("?µÎ????±Î°ù?òÏãúÍ≤†Ïäµ?àÍπå?")) return;

    setSubmitting(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/reviews/${id}/reply`,
        { content: replyContent, responder: "Admin" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.data && response.data.success) {
        alert("?µÎ????±Î°ù?òÏóà?µÎãà??");
        setReplyContent("");
        fetchReviewDetail();
      }
    } catch (error) {
      alert("?µÎ? ?±Î°ù Ï§??§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§.");
    } finally {
      setSubmitting(false);
    }
  };

  // ?µÎ? ??†ú
  const handleDeleteReply = async (replyId) => {
    if (!window.confirm("?µÎ?????†ú?òÏãúÍ≤†Ïäµ?àÍπå?")) return;

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/admin/reviews/reply/${replyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.data && response.data.success) {
        alert("?µÎ?????†ú?òÏóà?µÎãà??");
        fetchReviewDetail();
      }
    } catch (error) {
      alert("?µÎ? ??†ú Ï§??§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§.");
    }
  };

  // ‚≠??µÎ? ?òÏ†ï ?úÏûë
  const startEditReply = (reply) => {
    setEditingReplyId(reply.id);
    setEditedContent(reply.content);
  };

  // ‚≠??òÏ†ï Ï∑®ÏÜå
  const cancelEdit = () => {
    setEditingReplyId(null);
    setEditedContent("");
  };

  // ‚≠??òÏ†ï ?Ä??
  const saveEditedReply = async (replyId) => {
    if (!editedContent.trim()) {
      alert("?¥Ïö©???ÖÎ†•?¥Ï£º?∏Ïöî.");
      return;
    }

    if (!window.confirm("?µÎ????òÏ†ï?òÏãúÍ≤†Ïäµ?àÍπå?")) return;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/reviews/reply/${replyId}`,
        { content: editedContent },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.data && response.data.success) {
        alert("?µÎ????òÏ†ï?òÏóà?µÎãà??");
        setEditingReplyId(null);
        setEditedContent("");
        fetchReviewDetail();
      }
    } catch {
      alert("?µÎ? ?òÏ†ï Ï§??§Î•ò Î∞úÏÉù");
    }
  };

  // ‚≠??ÅÌíà ?ÅÏÑ∏ ?òÏù¥ÏßÄ ?¥Îèô ?®Ïàò Ï∂îÍ?
  const handleGoToProduct = () => {
    if (review?.productId) {
      window.location.href = `/products/${review.productId}`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating) => {
    return "??.repeat(rating) + "??.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="admin-review-detail">
        <AdminSidebar />
        <div className="review-detail-main">
          <div className="loading">Î°úÎî© Ï§?..</div>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="admin-review-detail">
        <AdminSidebar />
        <div className="review-detail-main">
          <div className="error">Î¶¨Î∑∞Î•?Ï∞æÏùÑ ???ÜÏäµ?àÎã§.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-review-detail">
      <AdminSidebar />

      <div className="review-detail-main">
        <div className="page-header">
          <h1>Î¶¨Î∑∞ ?ÅÏÑ∏</h1>
          <button
            className="btn-back"
            onClick={() => navigate("/admin/reviews")}
          >
            Î™©Î°ù?ºÎ°ú
          </button>
        </div>

        {/* Î¶¨Î∑∞ ?ïÎ≥¥ Ïπ¥Îìú */}
        <div className="review-info-card">
          <table className="detail-table">
            <tbody>
              <tr>
                <th>Î≤àÌò∏</th>
                <td>{review.id}</td>
              </tr>

              <tr>
                <th>?ëÏÑ±??/th>
                <td>{review.author || review.username}</td>
              </tr>

              <tr>
                <th>?ëÏÑ±?ºÏûê</th>
                <td>{formatDate(review.createdAt)}</td>
              </tr>

              <tr>
                <th>?ÅÌíàÎ™?/th>
                <td>
                  {review.productName ? (
                    <span className="product-link" onClick={handleGoToProduct}>
                      {review.productName} ?îó
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>

              <tr>
                <th>?âÏ†ê</th>
                <td>
                  <span className="stars">{renderStars(review.rating)}</span>
                  <span className="rating-number">{review.rating}/5</span>
                </td>
              </tr>

              <tr>
                <th>Î¶¨Î∑∞ ?¥Ïö©</th>
                <td className="content-cell">
                  <div className="content-box">{review.content}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ?µÎ? Î™©Î°ù */}
        <div className="replies-section">
          <h2>?µÎ? Î™©Î°ù ({replies.length})</h2>

          {replies.length > 0 ? (
            <div className="replies-list">
              {replies.map((reply) => (
                <div key={reply.id} className="reply-item">
                  <div className="reply-header">
                    <div className="reply-meta">
                      <span className="reply-author">{reply.author}</span>
                      <span className="reply-date">
                        {formatDate(reply.createdAt)}
                      </span>
                    </div>

                    {editingReplyId === reply.id ? (
                      <></>
                    ) : (
                      <div className="reply-actions">
                        <button
                          className="btn-edit"
                          onClick={() => startEditReply(reply)}
                        >
                          ?òÏ†ï
                        </button>
                        <button
                          className="btn-delete-reply"
                          onClick={() => handleDeleteReply(reply.id)}
                        >
                          ??†ú
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="reply-content">
                    {editingReplyId === reply.id ? (
                      <>
                        <textarea
                          className="reply-edit-textarea"
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className="reply-edit-actions">
                          <button className="btn-cancel" onClick={cancelEdit}>
                            Ï∑®ÏÜå
                          </button>
                          <button
                            className="btn-save"
                            onClick={() => saveEditedReply(reply.id)}
                          >
                            ?Ä??
                          </button>
                        </div>
                      </>
                    ) : (
                      reply.content
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-replies">?±Î°ù???µÎ????ÜÏäµ?àÎã§.</div>
          )}
        </div>

        {/* ?µÎ? ?ëÏÑ± */}
        <div className="reply-form">
          <h2>?µÎ? ?ëÏÑ±</h2>
          <textarea
            className="reply-textarea"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="?µÎ? ?¥Ïö©???ÖÎ†•?òÏÑ∏??
            rows="5"
            disabled={submitting}
          />
          <div className="reply-actions">
            <button
              className="btn-submit"
              onClick={handleSubmitReply}
              disabled={submitting || !replyContent.trim()}
            >
              {submitting ? "?±Î°ù Ï§?.." : "?µÎ? ?±Î°ù"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;

