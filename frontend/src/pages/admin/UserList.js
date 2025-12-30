import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";
import "./UserList.css";

const UserList = () => {
  const navigate = useNavigate();

  // ?Œì› ëª©ë¡ ?íƒœ
  const [users, setUsers] = useState([]);

  // ë¡œë”© ?íƒœ (API ?”ì²­ ì¤?
  const [loading, setLoading] = useState(false);

  // ?„ì²´ ? íƒ ì²´í¬ë°•ìŠ¤ ?íƒœ
  const [selectAll, setSelectAll] = useState(false);

  // ê²€?‰ì–´
  const [searchTerm, setSearchTerm] = useState("");

  // ?˜ì´ì§??íƒœ
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // API ê¸°ë³¸ URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  // ì»´í¬?ŒíŠ¸ ì²??Œë”ë§????Œì› ëª©ë¡ ë¶ˆëŸ¬?¤ê¸°
  useEffect(() => {
    fetchUsers();
  }, []);

  // ?Œì› ëª©ë¡ ì¡°íšŒ (ê²€???¬í•¨)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // ê²€???Œë¼ë¯¸í„° êµ¬ì„±
      const params = new URLSearchParams();
      if (searchTerm && searchTerm.trim()) {
        params.append("kw", searchTerm.trim());
      }

      const url = `${API_BASE_URL}/api/admin/users${
        params.toString() ? "?" + params.toString() : ""
      }`;

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // API ê²°ê³¼ë¥??”ë©´???°ì´?°ë¡œ ë³€??
      if (response.data && Array.isArray(response.data)) {
        const mappedUsers = response.data.map((user, index) => ({
          ...user,
          checked: false, // ê°œë³„ ? íƒ ì²´í¬ë°•ìŠ¤ ê¸°ë³¸ê°?
          no: (currentPage - 1) * itemsPerPage + index + 1, // ëª©ë¡ ë²ˆí˜¸
        }));

        setUsers(mappedUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      // ?¤ë¥˜ ë©”ì‹œì§€ ì²˜ë¦¬
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          alert("?¸ì¦ ?¤ë¥˜: ?¤ì‹œ ë¡œê·¸?¸í•´ì£¼ì„¸??");
        } else {
          alert("?Œì› ëª©ë¡??ë¶ˆëŸ¬?¤ëŠ”???¤íŒ¨?ˆìŠµ?ˆë‹¤.");
        }
      } else {
        alert("?œë²„???°ê²°?????†ìŠµ?ˆë‹¤.");
      }
      setUsers([]);
    } finally {
      setLoading(false);
      setSelectAll(false);
    }
  };

  // ?„ì²´ ? íƒ ì²´í¬ë°•ìŠ¤ ?´ë¦­ ??ëª¨ë“  ?Œì› ? íƒ/?´ì œ
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setUsers(users.map((user) => ({ ...user, checked })));
  };

  // ê°œë³„ ?Œì› ? íƒ
  const handleSelectUser = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, checked: !user.checked } : user
    );

    setUsers(updatedUsers);

    // ëª¨ë“  ??ª©??? íƒ?˜ë©´ selectAll ì²´í¬ ?œì„±??
    const allChecked = updatedUsers.every((user) => user.checked);
    setSelectAll(allChecked);
  };

  // ê²€???¤í–‰
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  // ? íƒ???Œì› ?? œ (?¤ì¤‘ ?? œ)
  const handleDeleteSelected = async () => {
    const selectedUsers = users.filter((user) => user.checked);

    if (selectedUsers.length === 0) {
      alert("?? œ???Œì›??? íƒ?´ì£¼?¸ìš”.");
      return;
    }

    if (
      !window.confirm(
        `? íƒ??${selectedUsers.length}ëª…ì˜ ?Œì›???? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?\n\n???‘ì—…?€ ?˜ëŒë¦????†ìŠµ?ˆë‹¤.`
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      const userIds = selectedUsers.map((user) => user.id);

      const response = await axios.post(
        `${API_BASE_URL}/api/admin/users/delete`,
        { ids: userIds },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.data && response.data.success) {
        alert(response.data.message);
        await fetchUsers(); // ëª©ë¡ ?ˆë¡œê³ ì¹¨
      } else {
        alert(response.data.message || "?Œì› ?? œ???¤íŒ¨?ˆìŠµ?ˆë‹¤.");
      }
    } catch (error) {
      if (error.response?.status === 403) {
        alert("?Œì› ?? œ ê¶Œí•œ???†ìŠµ?ˆë‹¤.");
      } else if (error.response?.status === 404) {
        alert("?¼ë? ?Œì›??ì°¾ì„ ???†ìŠµ?ˆë‹¤.");
        fetchUsers();
      } else {
        alert("?Œì› ?? œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.");
      }
    } finally {
      setLoading(false);
    }
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

  // ?±ë³„ ?¬ë§· (KOR/ENG/M/F/Male/Female ëª¨ë‘ ì²˜ë¦¬)
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
          <h1>User List</h1>

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
                {/* ?„ì²´ ? íƒ ì²´í¬ë°•ìŠ¤ */}
                <th style={{ width: "50px" }}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    disabled={currentUsers.length === 0}
                  />
                </th>
                <th style={{ width: "80px" }}>No</th>
                <th>?´ë¦„</th>
                <th>ID</th>
                <th>?±ë³„</th>
                <th>?°ë½ì²?/th>
                <th>?ë…„?”ì¼</th>
                <th>ê°€?…ì¼??/th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* ê°œë³„ ? íƒ ì²´í¬ë°•ìŠ¤ */}
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={user.checked || false}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </td>
                    <td>{user.no}</td>
                    <td>{user.username || "-"}</td>
                    <td>{user.userId || user.email || "-"}</td>
                    <td>{formatGender(user.gender)}</td>
                    <td>{formatPhone(user.phone)}</td>
                    <td>{formatDate(user.birthDate)}</td>
                    <td>{formatDate(user.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    {loading ? "ë¡œë”© ì¤?.." : "?±ë¡???Œì›???†ìŠµ?ˆë‹¤."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ?? œ ë²„íŠ¼ + ?˜ì´ì§€?¤ì´??*/}
        <div
          className="table-footer"
          style={{
            display: "flex !important",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px 30px",
            background: "white",
            borderTop: "1px solid #e0e0e0",
            borderRadius: "0 0 8px 8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            marginTop: "-8px",
            position: "relative",
          }}
        >
          {/* ? íƒ ?Œì› ?? œ */}
          <button
            className="user-list-delete-btn"
            style={{
              padding: "10px 30px",
              background: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s",
              position: "absolute",
              left: "30px",
            }}
            onClick={handleDeleteSelected}
          >
            ?? œ
          </button>

          {/* ?˜ì´ì§€?¤ì´??*/}
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

export default UserList;

