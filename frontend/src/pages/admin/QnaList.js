import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";
import axios from "axios";
import "./QnaList.css";

const QnaList = () => {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  const [qnaList, setQnaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchQnaList();
  }, []);

  const fetchQnaList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/qna`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      console.log("Q&A Î™©Î°ù ?ëÎãµ:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setQnaList(response.data);
      } else if (response.data.data && Array.isArray(response.data.data)) {
        setQnaList(response.data.data);
      } else {
        setQnaList([]);
      }
    } catch (error) {
      console.error("Q&A Î™©Î°ù Ï°∞Ìöå ?§Ìå®:", error);
      alert("Q&A Î™©Î°ù??Î∂àÎü¨?§Îäî???§Ìå®?àÏäµ?àÎã§.");
      setQnaList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchQnaList();
  };

  const handleRowClick = (qnaId) => {
    navigate(`/admin/qna/${qnaId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  // Í≤Ä?âÏñ¥ ?ÑÌÑ∞Îß?
  const filteredQnaList = qnaList.filter((qna) => {
    if (!searchKeyword.trim()) return true;

    const keyword = searchKeyword.toLowerCase();
    return (
      qna.title?.toLowerCase().includes(keyword) ||
      qna.question?.toLowerCase().includes(keyword) ||
      qna.writer?.toLowerCase().includes(keyword) ||
      qna.productName?.toLowerCase().includes(keyword)
    );
  });

  // ?òÏù¥ÏßÄ?§Ïù¥??
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQnaList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredQnaList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Î°úÎî© Ï§?..</div>
      </div>
    );
  }

  return (
    <div className="admin-qna-list">
      <AdminSidebar />

      <div className="qna-list-main">
        <div className="page-header">
          <h1>Q&A Í¥ÄÎ¶?/h1>

          <div className="search-box">
            <input
              type="text"
              placeholder="?úÎ™© ?êÎäî ?ëÏÑ±?êÎ? ?ÖÎ†•?òÏÑ∏??
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch} className="search-btn">
              ?îç
            </button>
          </div>
        </div>

        {/* Q&A Î™©Î°ù ?åÏù¥Î∏?*/}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Î≤àÌò∏</th>
                <th style={{ width: "200px" }}>?ÅÌíàÎ™?/th>
                <th>?úÎ™©</th>
                <th style={{ width: "120px" }}>?ëÏÑ±??/th>
                <th style={{ width: "150px" }}>?ëÏÑ±?ºÏûê</th>
                <th style={{ width: "100px" }}>?µÎ??ÅÌÉú</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    Q&AÍ∞Ä ?ÜÏäµ?àÎã§.
                  </td>
                </tr>
              ) : (
                currentItems.map((qna, index) => (
                  <tr
                    key={qna.id}
                    onClick={() => handleRowClick(qna.id)}
                    className="clickable-row"
                  >
                    <td>
                      {filteredQnaList.length - (indexOfFirstItem + index)}
                    </td>
                    <td className="text-left">{qna.productName || "-"}</td>
                    <td className="text-left">
                      {qna.isPrivate && (
                        <span className="private-icon" title="ÎπÑÎ?Í∏Ä">
                          ?îí
                        </span>
                      )}
                      {qna.title || qna.question}
                    </td>
                    <td>{qna.writer || "-"}</td>
                    <td>{formatDate(qna.createdAt)}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          qna.replies && qna.replies.length > 0
                            ? "answered"
                            : "pending"
                        }`}
                      >
                        {qna.replies && qna.replies.length > 0
                          ? "?µÎ??ÑÎ£å"
                          : "ÎØ∏ÎãµÎ≥Ä"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
                className={`page-button ${
                  currentPage === index + 1 ? "active" : ""
                }`}
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

        {/* ?µÍ≥Ñ ?ïÎ≥¥ */}
        <div className="qna-stats">
          <p>?ÑÏ≤¥ Q&A: {filteredQnaList.length}Í∞?/p>
          <p>
            ÎØ∏ÎãµÎ≥Ä:{" "}
            {
              filteredQnaList.filter(
                (q) => !q.replies || q.replies.length === 0
              ).length
            }
            Í∞?/ ?µÎ??ÑÎ£å:{" "}
            {
              filteredQnaList.filter((q) => q.replies && q.replies.length > 0)
                .length
            }
            Í∞?
          </p>
        </div>
      </div>
    </div>
  );
};

export default QnaList;

