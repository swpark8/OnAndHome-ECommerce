import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";
import "./QnaDetail.css";

const QnaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  const [qna, setQna] = useState(null);
  const [loading, setLoading] = useState(true);

  // ?µÎ? ?±Î°ù??
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ?µÎ? ?òÏ†ï??
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState("");

  useEffect(() => {
    fetchQnaDetail();
  }, [id]);

  const fetchQnaDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/qna/${id}`);
      const data = response.data.data || response.data;
      setQna(data);
    } catch {
      alert("Q&A ?ïÎ≥¥ Ï°∞Ìöå ?§Ìå®");
      navigate("/admin/qna");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // ?µÎ? ?±Î°ù
  // -------------------------
  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return alert("?µÎ????ÖÎ†•?òÏÑ∏??");

    if (!window.confirm("?µÎ????±Î°ù?òÏãúÍ≤†Ïäµ?àÍπå?")) return;

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/qna/${id}/reply`,
        {
          content: replyContent,
          responder: "Admin",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (res.data.success) {
        alert("?µÎ? ?±Î°ù ?ÑÎ£å");
        setReplyContent("");
        fetchQnaDetail();
      }
    } catch {
      alert("?µÎ? ?±Î°ù Ï§??§Î•ò Î∞úÏÉù");
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------
  // ?µÎ? ?òÏ†ï ?úÏûë
  // -------------------------
  const handleEditReply = (reply) => {
    setEditingReplyId(reply.id);
    setEditReplyContent(reply.content);
  };

  // -------------------------
  // ?µÎ? ?òÏ†ï ?Ä??
  // -------------------------
  const handleSaveReply = async (replyId) => {
    if (!editReplyContent.trim()) {
      alert("?µÎ? ?¥Ïö©???ÖÎ†•?òÏÑ∏??");
      return;
    }

    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/admin/qna/reply/${replyId}`,
        { content: editReplyContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (res.data.success) {
        alert("?µÎ? ?òÏ†ï ?ÑÎ£å");
        setEditingReplyId(null);
        fetchQnaDetail();
      }
    } catch (e) {
      alert("?µÎ? ?òÏ†ï ?§Ìå®");
    }
  };

  // -------------------------
  // ?µÎ? ?òÏ†ï Ï∑®ÏÜå
  // -------------------------
  const handleCancelReply = () => {
    setEditingReplyId(null);
    setEditReplyContent("");
  };

  // -------------------------
  // ?µÎ? ??†ú
  // -------------------------
  const handleDeleteReply = async (replyId) => {
    if (!window.confirm("?µÎ?????†ú?òÏãúÍ≤†Ïäµ?àÍπå?")) return;

    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/admin/qna/reply/${replyId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (res.data.success) {
        alert("??†ú ?±Í≥µ");
        fetchQnaDetail();
      }
    } catch {
      alert("??†ú ?§Ìå®");
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

  const handleGoToProduct = () => {
    if (qna?.productId) {
      window.open(`/products/${qna.productId}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="admin-qna-detail">
        <AdminSidebar />
        <div className="qna-detail-main">
          <div className="loading">Î°úÎî© Ï§?..</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-qna-detail">
      <AdminSidebar />
      <div className="qna-detail-main">
        {/* ?§Îçî */}
        <div className="page-header">
          <h1>Q&A ?ÅÏÑ∏</h1>
          <button
            className="back-button"
            onClick={() => navigate("/admin/qna")}
          >
            Î™©Î°ù?ºÎ°ú
          </button>
        </div>

        {/* Q&A Î≥∏Î¨∏ Ïπ¥Îìú */}
        <div className="qna-detail-card">
          <table className="detail-table">
            <tbody>
              <tr>
                <th>Î≤àÌò∏</th>
                <td>{qna.id}</td>
              </tr>
              <tr>
                <th>?ÅÌíàÎ™?/th>
                <td>
                  {qna.productName ? (
                    <span className="product-link" onClick={handleGoToProduct}>
                      {qna.productName} <span className="link-icon">?îó</span>
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
              <tr>
                <th>?ëÏÑ±?ºÏûê</th>
                <td>{formatDate(qna.createdAt)}</td>
              </tr>
              <tr>
                <th>?ëÏÑ±??/th>
                <td>{qna.writer}</td>
              </tr>
              <tr>
                <th>?úÎ™©</th>
                <td>
                  {qna.isPrivate && (
                    <span className="private-icon" title="ÎπÑÎ?Í∏Ä">
                      ?îí{" "}
                    </span>
                  )}
                  {qna.title}
                </td>
              </tr>
              <tr>
                <th>ÏßàÎ¨∏ ?¥Ïö©</th>
                <td className="content-cell">
                  <div className="content-box">{qna.question}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ?µÎ? Î™©Î°ù */}
        {qna.replies?.length > 0 && (
          <div className="replies-section">
            <h3>?µÎ? Î™©Î°ù</h3>

            {qna.replies.map((reply) => (
              <div className="reply-card" key={reply.id}>
                <div className="reply-header">
                  <span className="reply-author">
                    {reply.responder || "Admin"}
                  </span>
                  <span className="reply-date">
                    {formatDate(reply.createdAt)}
                  </span>
                </div>

                {/* ?òÏ†ï Î™®Îìú */}
                {editingReplyId === reply.id ? (
                  <>
                    <textarea
                      className="reply-edit-textarea"
                      value={editReplyContent}
                      onChange={(e) => setEditReplyContent(e.target.value)}
                      rows={4}
                    />

                    <div className="reply-actions">
                      <button
                        className="cancel-button"
                        onClick={handleCancelReply}
                      >
                        Ï∑®ÏÜå
                      </button>
                      <button
                        className="save-button"
                        onClick={() => handleSaveReply(reply.id)}
                      >
                        ?Ä??
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="reply-content">{reply.content}</div>

                    <div className="reply-actions">
                      <button
                        className="edit-button"
                        onClick={() => handleEditReply(reply)}
                      >
                        ?òÏ†ï
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteReply(reply.id)}
                      >
                        ??†ú
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ?µÎ? ?±Î°ù */}
        <div className="reply-form-section">
          <h3>?µÎ? ?±Î°ù</h3>
          <div className="reply-form">
            <textarea
              placeholder="?µÎ????ÖÎ†•?òÏÑ∏??
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows="6"
              className="reply-textarea"
            />
            <div className="form-actions">
              <button
                className="cancel-button"
                onClick={() => navigate("/admin/qna")}
              >
                Î™©Î°ù
              </button>
              <button
                className="submit-button"
                disabled={submitting}
                onClick={handleSubmitReply}
              >
                {submitting ? "?±Î°ù Ï§?.." : "?µÎ??±Î°ù"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QnaDetail;

