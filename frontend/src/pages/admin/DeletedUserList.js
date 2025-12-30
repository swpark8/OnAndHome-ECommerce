import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";
import apiClient from "../../api/axiosConfig";
import "./UserList.css";

const DeletedUserList = () => {
  const navigate = useNavigate();

  // ?ˆí‡´ ?Œì› ëª©ë¡ ?íƒœ
  const [users, setUsers] = useState([]);

  // ë¡œë”© ?íƒœ (API ?”ì²­ ì¤?
  const [loading, setLoading] = useState(false);

  // ê²€?‰ì–´
  const [searchTerm, setSearchTerm] = useState("");

  // ?˜ì´ì§??íƒœ
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ì»´í¬?ŒíŠ¸ ì²??Œë”ë§????ˆí‡´ ?Œì› ëª©ë¡ ë¶ˆëŸ¬?¤ê¸°
  useEffect(() => {
    fetchDeletedUsers();
  }, []);

  // ?ˆí‡´ ?Œì› ëª©ë¡ ì¡°íšŒ (ê²€???¬í•¨)
  const fetchDeletedUsers = async () => {
    setLoading(true);
    try {
      // ê²€???Œë¼ë¯¸í„° êµ¬ì„±
      const params = new URLSearchParams();
      if (searchTerm && searchTerm.trim()) {
        params.append("kw", searchTerm.trim());
      }

      const url = `/api/admin/users/deleted${
        params.toString() ? "?" + params.toString() : ""
      }`;

      const response = await apiClient.get(url);

      // API ê²°ê³¼ë¥??”ë©´???°ì´?°ë¡œ ë³€??
      if (response.data && Array.isArray(response.data)) {
        const mappedUsers = response.data.map((user, index) => ({
          ...user,
          no: (currentPage - 1) * itemsPerPage + index + 1, // ëª©ë¡ ë²ˆí˜¸
        }));

        setUsers(mappedUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      // ?¤ë¥˜ ë©”ì‹œì§€ ì²˜ë¦¬
      console.error("?ˆí‡´ ?Œì› ëª©ë¡ ì¡°íšŒ ?¤ë¥˜:", error);
      if (error.response) {
        if (error.response.status === 401) {
          alert("?¸ì¦??ë§Œë£Œ?˜ì—ˆ?µë‹ˆ?? ?¤ì‹œ ë¡œê·¸?¸í•´ì£¼ì„¸??");
        } else if (error.response.status === 403) {
          // 403 ?¤ë¥˜??ë°±ì—”??APIê°€ ?†ê±°??ê¶Œí•œ ?¤ì • ë¬¸ì œ
          console.warn(
            "403 ?¤ë¥˜: ë°±ì—”??API ê¶Œí•œ ?•ì¸ ?„ìš” (/api/admin/users/deleted)"
          );
          // ë¹?ë°°ì—´ë¡?ì²˜ë¦¬?˜ê³  ?ëŸ¬ ë©”ì‹œì§€ ?œì‹œ ?ˆí•¨
        } else {
          alert("?ˆí‡´ ?Œì› ëª©ë¡??ë¶ˆëŸ¬?¤ëŠ”???¤íŒ¨?ˆìŠµ?ˆë‹¤.");
        }
      } else {
        alert("?œë²„???°ê²°?????†ìŠµ?ˆë‹¤.");
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ê²€???¤í–‰
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDeletedUsers();
  };

  // ?˜ì´ì§€ ë³€ê²?
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ? ì§œ ?¬ë§· YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return dateString;
    }
  };

  // ?„í™”ë²ˆí˜¸ ?¬ë§·
  const formatPhone = (phone) => {
    if (!phone) return "-";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
        7
      )}`;
    } else if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(
        6
      )}`;
    }
    return phone;
  };

  // ?±ë³„ ?¬ë§·
  const formatGender = (gender) => {
    if (!gender) return "-";
    if (gender.toUpperCase() === "MALE" || gender === "?¨ì" || gender === "M")
      return "?¨ì";
    if (
      gender.toUpperCase() === "FEMALE" ||
      gender === "?¬ì" ||
      gender === "F"
    )
      return "?¬ì";
    return gender;
  };

  // ?˜ì´ì§€?¤ì´??ê³„ì‚°
  const totalPages = Math.max(1, Math.ceil(users.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  return (
    <div className="admin-user-list">
      <AdminSidebar />

      <div className="user-list-main">
        <div className="page-header">
          <h1>?ˆí‡´ ?Œì› ëª©ë¡</h1>

          {/* ê²€???…ë ¥ì°?*/}
          <div className="search-box">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="?´ë¦„ ?ëŠ” ?„ì´?”ë? ?…ë ¥?˜ì„¸??
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="search-btn">
                ?”
              </button>
            </form>
          </div>
        </div>

        {/* ë¡œë”© ?”ë©´ */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner">ë¡œë”© ì¤?..</div>
          </div>
        )}

        {/* ?Œì› ?Œì´ë¸?*/}
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>No</th>
                <th>?´ë¦„</th>
                <th>ID</th>
                <th>?±ë³„</th>
                <th>?°ë½ì²?/th>
                <th>?ë…„?”ì¼</th>
                <th>ê°€?…ì¼??/th>
                <th>?ˆí‡´?¼ì</th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.no}</td>
                    <td>{user.username || "-"}</td>
                    <td>{user.userId || user.email || "-"}</td>
                    <td>{formatGender(user.gender)}</td>
                    <td>{formatPhone(user.phone)}</td>
                    <td>{formatDate(user.birthDate)}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>{formatDate(user.deletedAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    {loading ? "ë¡œë”© ì¤?.." : "?ˆí‡´???Œì›???†ìŠµ?ˆë‹¤."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ?˜ì´ì§€?¤ì´??*/}
        <div
          className="table-footer"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px 30px",
            background: "white",
            borderTop: "1px solid #e0e0e0",
            borderRadius: "0 0 8px 8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            marginTop: "-8px",
          }}
        >
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              ?´ì „
            </button>
            <span className="page-info">
              {currentPage} / {totalPages}
            </span>
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
            >
              ?¤ìŒ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletedUserList;

