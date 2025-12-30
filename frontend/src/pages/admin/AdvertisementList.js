import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import advertisementApi from "../../api/advertisementApi";
import AdminSidebar from "../../components/layout/AdminSidebar";
import "./AdvertisementList.css";

const AdvertisementList = () => {
  const navigate = useNavigate();
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const response = await advertisementApi.getAll();
      if (response.success) {
        setAdvertisements(response.advertisements);
      }
    } catch (error) {
      console.error("Í¥ëÍ≥† Î™©Î°ù Ï°∞Ìöå ?§Ìå®:", error);
      toast.error("Í¥ëÍ≥† Î™©Î°ù??Î∂àÎü¨?§Îäî???§Ìå®?àÏäµ?àÎã§.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredAdvertisements = advertisements.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdvertisements = filteredAdvertisements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAdvertisements.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCreate = () => {
    navigate("/admin/advertisements/create");
  };

  const handleEdit = (id) => {
    navigate(`/admin/advertisements/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("?ïÎßê ??†ú?òÏãúÍ≤†Ïäµ?àÍπå?")) {
      return;
    }

    try {
      const response = await advertisementApi.delete(id);
      if (response.success) {
        toast.success("Í¥ëÍ≥†Í∞Ä ??†ú?òÏóà?µÎãà??");
        fetchAdvertisements();
      }
    } catch (error) {
      console.error("Í¥ëÍ≥† ??†ú ?§Ìå®:", error);
      toast.error("Í¥ëÍ≥† ??†ú???§Ìå®?àÏäµ?àÎã§.");
    }
  };

  const handleSendNotification = async (id, title) => {
    if (
      !window.confirm(
        `'${title}' Í¥ëÍ≥† ?åÎ¶º??Î∞úÏÜ°?òÏãúÍ≤†Ïäµ?àÍπå?\nÎßàÏ????ôÏùò???¨Ïö©?êÏóêÍ≤åÎßå ?ÑÏÜ°?©Îãà??`
      )
    ) {
      return;
    }

    try {
      const response = await advertisementApi.sendNotification(id);
      if (response.success) {
        toast.success(response.message);
        fetchAdvertisements();
      }
    } catch (error) {
      console.error("Í¥ëÍ≥† ?åÎ¶º Î∞úÏÜ° ?§Ìå®:", error);
      toast.error("Í¥ëÍ≥† ?åÎ¶º Î∞úÏÜ°???§Ìå®?àÏäµ?àÎã§.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, "-")
      .replace(".", "");
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="dashboard-main">
          <div className="loading">Î°úÎî©Ï§?..</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <div className="dashboard-main">
        <div className="notice-container">
          <div className="notice-header">
            <h1>Í¥ëÍ≥† Í¥ÄÎ¶?/h1>
            <p className="notice-description">
              ÎßàÏ????ôÏùò ?¨Ïö©?êÏóêÍ≤??ÑÏÜ°??Í¥ëÍ≥†Î•?Í¥ÄÎ¶¨Ìï©?àÎã§
            </p>
          </div>

          <div className="notice-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="?úÎ™© ?êÎäî ?¥Ïö©?ºÎ°ú Í≤Ä??.."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <span className="search-icon">?îç</span>
            </div>
            <button onClick={handleCreate} className="btn-write">
              ?èÔ∏è Í¥ëÍ≥† ?±Î°ù
            </button>
          </div>

          <div className="advertisement-stats">
            <div className="stat-item">
              <span className="stat-label">?ÑÏ≤¥ Í¥ëÍ≥†</span>
              <span className="stat-value">{advertisements.length}Í∞?/span>
            </div>
            <div className="stat-item">
              <span className="stat-label">?úÏÑ± Í¥ëÍ≥†</span>
              <span className="stat-value">
                {advertisements.filter((ad) => ad.active).length}Í∞?
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Î∞úÏÜ°??Í¥ëÍ≥†</span>
              <span className="stat-value">
                {advertisements.filter((ad) => ad.sentAt).length}Í∞?
              </span>
            </div>
          </div>

          <div className="notice-count">
            ?ÑÏ≤¥ {filteredAdvertisements.length}Í±?
          </div>

          {currentAdvertisements.length === 0 ? (
            <div className="empty-state">
              <p>?±Î°ù??Í¥ëÍ≥†Í∞Ä ?ÜÏäµ?àÎã§.</p>
            </div>
          ) : (
            <>
              <table className="notice-table">
                <thead>
                  <tr>
                    <th style={{ width: "80px" }}>Î≤àÌò∏</th>
                    <th>?úÎ™©</th>
                    <th style={{ width: "120px" }}>?ëÏÑ±??/th>
                    <th style={{ width: "120px" }}>?ëÏÑ±??/th>
                    <th style={{ width: "250px" }}>Í¥ÄÎ¶?/th>
                  </tr>
                </thead>
                <tbody>
                  {currentAdvertisements.map((ad, index) => (
                    <tr key={ad.id}>
                      <td>
                        {filteredAdvertisements.length -
                          (indexOfFirstItem + index)}
                      </td>
                      <td className="title-cell">
                        <span className="title-text">{ad.title}</span>
                        {!ad.active && (
                          <span className="status-badge inactive">ÎπÑÌôú??/span>
                        )}
                        {ad.sentAt && (
                          <span className="status-badge sent">Î∞úÏÜ°?ÑÎ£å</span>
                        )}
                      </td>
                      <td>Í¥ÄÎ¶¨Ïûê</td>
                      <td>{formatDate(ad.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          {!ad.sentAt && ad.active && (
                            <button
                              className="btn-action btn-send"
                              onClick={() =>
                                handleSendNotification(ad.id, ad.title)
                              }
                            >
                              Î∞úÏÜ°
                            </button>
                          )}
                          <button
                            className="btn-action btn-edit"
                            onClick={() => handleEdit(ad.id)}
                          >
                            ?òÏ†ï
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={() => handleDelete(ad.id)}
                          >
                            ??†ú
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="page-btn"
                  >
                    Ï≤òÏùå
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="page-btn"
                  >
                    ?¥Ï†Ñ
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`page-btn ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="page-btn"
                  >
                    ?§Ïùå
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="page-btn"
                  >
                    ÎßàÏ?Îß?
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

export default AdvertisementList;

