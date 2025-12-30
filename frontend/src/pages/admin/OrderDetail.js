import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";
import "./OrderDetail.css";

const OrderDetail = () => {
  // URL?�서 주문 ID 추출 (/admin/orders/:id)
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  const [order, setOrder] = useState(null); // 주문 ?�세 ?�이??
  const [loading, setLoading] = useState(true); // ?�이지 로딩 ?�태
  const [statusUpdating, setStatusUpdating] = useState(false); // ?�태 변�?�??��? ?�시

  // ?�이지 최초 로딩 ??주문 ?�세 ?�보 조회
  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  // 관리자 주문 ?�세 조회
  // GET /api/admin/orders/{id}
  const fetchOrderDetail = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/orders/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log("주문 ?�세 ?�답:", response.data);
      setOrder(response.data);
    } catch (error) {
      console.error("주문 ?�세 조회 ?�패:", error);
      alert("주문 ?�보�?불러?�는???�패?�습?�다.");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  // 주문 ?�태 변�?처리
  // PUT /api/admin/orders/{id}/status
  const handleStatusChange = async (newStatus) => {
    if (
      !window.confirm(
        `주문 ?�태�?"${getStatusText(newStatus)}"(??�?변경하?�겠?�니�?`
      )
    ) {
      return;
    }

    setStatusUpdating(true);

    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/orders/${id}/status`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      alert("주문 ?�태가 변경되?�습?�다.");
      fetchOrderDetail(); // 변�???최신 ?�이???�시 조회
    } catch (error) {
      console.error("?�태 변�??�패:", error);
      alert("?�태 변경에 ?�패?�습?�다.");
    } finally {
      setStatusUpdating(false);
    }
  };

  // ?�짜 ?�기: YYYY-MM-DD HH:mm
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

  // 금액 ?�맷
  const formatPrice = (price) => {
    return price ? price.toLocaleString() + "?? : "0??;
  };

  // 주문 ?�태�??��? ?�스?�로 변??
  const getStatusText = (status) => {
    const statusMap = {
      ORDERED: "결제?�료",
      CANCELED: "취소",
      DELIVERING: "배송�?,
      DELIVERED: "배송?�료",
    };
    return statusMap[status] || status;
  };

  // ?�태???�른 CSS ?�래??
  const getStatusBadgeClass = (status) => {
    const classMap = {
      ORDERED: "status-ordered",
      CANCELED: "status-canceled",
      DELIVERING: "status-delivering",
      DELIVERED: "status-delivered",
    };
    return classMap[status] || "";
  };

  // 로딩 ?�태 ?�시
  if (loading) {
    return (
      <div className="admin-order-detail">
        <AdminSidebar />
        <div className="order-detail-main">
          <div className="loading">로딩 �?..</div>
        </div>
      </div>
    );
  }

  // 주문??존재?��? ?�을 경우
  if (!order) {
    return (
      <div className="admin-order-detail">
        <AdminSidebar />
        <div className="order-detail-main">
          <div className="error-message">주문 ?�보�?찾을 ???�습?�다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-order-detail">
      <AdminSidebar />

      <div className="order-detail-main">
        {/* ?�단 ?�더 */}
        <div className="page-header">
          <div className="header-left">
            <button
              className="back-btn"
              onClick={() => navigate("/admin/orders")}
            >
              ??목록?�로
            </button>
            <h1>주문 ?�세</h1>
          </div>

          {/* ?�재 주문 ?�태 배�? */}
          <div className="header-right">
            <span
              className={`status-badge ${getStatusBadgeClass(order.status)}`}
            >
              {getStatusText(order.status)}
            </span>
          </div>
        </div>

        {/* 주문 기본 ?�보 */}
        <div className="detail-section">
          <h2>주문 ?�보</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">주문번호</span>
              <span className="info-value">{order.orderNumber}</span>
            </div>

            <div className="info-item">
              <span className="info-label">주문?�시</span>
              <span className="info-value">{formatDate(order.createdAt)}</span>
            </div>

            <div className="info-item">
              <span className="info-label">주문?�태</span>
              <span className="info-value">
                <span
                  className={`status-badge ${getStatusBadgeClass(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">�?주문금액</span>
              <span className="info-value highlight">
                {formatPrice(order.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* 주문???�보 */}
        <div className="detail-section">
          <h2>주문???�보</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">구매??ID</span>
              <span className="info-value">{order.userId || "-"}</span>
            </div>

            <div className="info-item">
              <span className="info-label">구매?�명</span>
              <span className="info-value">
                {order.userName || order.username || "-"}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">?�락�?/span>
              <span className="info-value">{order.phone || "-"}</span>
            </div>

            <div className="info-item">
              <span className="info-label">?�메??/span>
              <span className="info-value">{order.email || "-"}</span>
            </div>
          </div>
        </div>

        {/* 배송지 ?�보 */}
        <div className="detail-section">
          <h2>배송지 ?�보</h2>
          <div className="info-grid">
            <div className="info-item full-width">
              <span className="info-label">배송지 주소</span>
              <span className="info-value">{order.address || "-"}</span>
            </div>

            <div className="info-item full-width">
              <span className="info-label">배송 메시지</span>
              <span className="info-value">
                {order.deliveryMessage || "?�음"}
              </span>
            </div>
          </div>
        </div>

        {/* 주문 ?�품 ?�보 */}
        <div className="detail-section">
          <h2>주문 ?�품</h2>

          <div className="order-items-table">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>번호</th>
                  <th>?�품�?/th>
                  <th style={{ width: "100px" }}>?�량</th>
                  <th style={{ width: "120px" }}>?��?</th>
                  <th style={{ width: "120px" }}>금액</th>
                </tr>
              </thead>

              <tbody>
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-left">{item.productName}</td>
                      <td className="text-center">{item.quantity}�?/td>
                      <td className="text-right">{formatPrice(item.price)}</td>
                      <td className="text-right">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      주문 ?�품???�습?�다.
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan="4" className="text-right total-label">
                    �?주문금액
                  </td>

                  <td className="text-right total-price">
                    {formatPrice(order.totalPrice)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* ?�태 변�?버튼 ?�역 */}
        <div className="detail-section">
          <h2>주문 ?�태 관�?/h2>

          <div className="status-buttons">
            <button
              className="status-btn btn-ordered"
              onClick={() => handleStatusChange("ORDERED")}
              disabled={statusUpdating || order.status === "ORDERED"}
            >
              결제?�료
            </button>

            <button
              className="status-btn btn-delivering"
              onClick={() => handleStatusChange("DELIVERING")}
              disabled={statusUpdating || order.status === "DELIVERING"}
            >
              배송�?
            </button>

            <button
              className="status-btn btn-delivered"
              onClick={() => handleStatusChange("DELIVERED")}
              disabled={statusUpdating || order.status === "DELIVERED"}
            >
              배송?�료
            </button>

            <button
              className="status-btn btn-canceled"
              onClick={() => handleStatusChange("CANCELED")}
              disabled={statusUpdating || order.status === "CANCELED"}
            >
              취소
            </button>
          </div>

          {statusUpdating && (
            <div className="status-updating">?�태 변�?�?..</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

