import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";
import "./OrderList.css";

const OrderList = () => {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  const [orders, setOrders] = useState([]); // ?�체 주문 목록
  const [loading, setLoading] = useState(true); // 로딩 ?�태
  const [searchTerm, setSearchTerm] = useState(""); // 검???�스??
  const [filterStatus, setFilterStatus] = useState("all"); // ?�태 ?�터 조건

  useEffect(() => {
    // 관리자 ?�이지 ?�속 ??최초 ??�?주문 목록 조회
    fetchOrders();
  }, []);

  // 관리자???�체 주문 목록 조회
  // 백엔?? GET /api/admin/orders
  // 결제 ????배송�?취소 ?�함 ?�체 리스??반환
  const fetchOrders = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // 백엔?��? 배열??반환?�는 경우?�만 ?�??
      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("주문 목록 조회 ?�패:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // 주문 ?�세 ?�이지 ?�동
  const handleRowClick = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  // 검??+ ?�태 ?�터 ?�용??주문 목록
  // 1) 주문번호 검??
  // 2) 구매??ID(searchTerm 매칭)
  // 3) 구매?�명(userName/username)
  // 4) ?�태 ?�터(filterStatus)
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchTerm ||
      order.orderNumber?.includes(searchTerm) ||
      order.userId?.includes(searchTerm) ||
      (order.userName || order.username || "").includes(searchTerm);

    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-order-list">
        <AdminSidebar />
        <div className="order-list-main">
          <div className="loading">로딩 �?..</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-order-list">
      <AdminSidebar />

      <div className="order-list-main">
        {/* ?�이지 ?�단 ?�더 */}
        <div className="page-header">
          <h1>Order List</h1>

          <div className="header-controls">
            {/* 주문 ?�태 ?�터 */}
            {/* 백엔??ENUM(OrderStatus)�??�동?�는 ?�택 ?�션 */}
            <select
              className="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">?�체 ?�태</option>
              <option value="ORDERED">결제?�료</option>
              <option value="DELIVERING">배송�?/option>
              <option value="DELIVERED">배송?�료</option>
              <option value="CANCELED">취소</option>
            </select>

            {/* 검?�창 (주문번호/구매??검?? */}
            <div className="search-box">
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="주문번호 ?�는 구매?�명???�력?�세??
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  ?��
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 주문 ?�이�?*/}
        <div className="order-table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>주문번호</th>
                <th>?�품�?/th>
                <th>주문가�?/th>
                <th>구매??ID</th>
                <th>구매?�명</th>
                <th>주문?�태</th>
                <th>주문?�자</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7">조회??주문???�습?�다.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  // 주문 �?번째 ?�품�?+ ??�?�??�시
                  let productName = "-";
                  if (
                    order.orderItems &&
                    Array.isArray(order.orderItems) &&
                    order.orderItems.length > 0
                  ) {
                    const first = order.orderItems[0];
                    productName = first.productName || "-";

                    if (order.orderItems.length > 1) {
                      productName += ` ??${order.orderItems.length - 1}�?;
                    }
                  }

                  // 가�??�시 ?�맷
                  const price = order.totalPrice
                    ? order.totalPrice.toLocaleString() + "??
                    : "0??;

                  // ?�짜 ?�맷 (YYYY-MM-DD)
                  let dateStr = "-";
                  if (order.createdAt) {
                    try {
                      const d = new Date(order.createdAt);
                      dateStr = `${d.getFullYear()}-${String(
                        d.getMonth() + 1
                      ).padStart(2, "0")}-${String(d.getDate()).padStart(
                        2,
                        "0"
                      )}`;
                    } catch (e) {
                      dateStr = "-";
                    }
                  }

                  // 주문 ?�태 ???��? 변??
                  const statusMap = {
                    ORDERED: "결제?�료",
                    CANCELED: "취소",
                    DELIVERING: "배송�?,
                    DELIVERED: "배송?�료",
                  };
                  const statusText = statusMap[order.status] || order.status;

                  // ?�태???�른 CSS ?�래??
                  const statusClassMap = {
                    ORDERED: "status-paid",
                    CANCELED: "status-cancelled",
                    DELIVERING: "status-shipping",
                    DELIVERED: "status-delivered",
                  };
                  const statusClass = statusClassMap[order.status] || "";

                  return (
                    <tr
                      key={order.id}
                      onClick={() => handleRowClick(order.id)}
                      className="clickable-row"
                    >
                      {/* 주문번호 */}
                      <td>{order.orderNumber || "-"}</td>

                      {/* ?�품�?*/}
                      <td style={{ textAlign: "left", paddingLeft: "15px" }}>
                        {productName}
                      </td>

                      {/* 가�?*/}
                      <td style={{ textAlign: "right", paddingRight: "15px" }}>
                        {price}
                      </td>

                      {/* 구매??ID */}
                      <td>{order.userId || "-"}</td>

                      {/* 구매???�름 */}
                      <td>{order.userName || order.username || "-"}</td>

                      {/* ?�태 */}
                      <td>
                        <span className={`status-badge ${statusClass}`}>
                          {statusText}
                        </span>
                      </td>

                      {/* 주문?�자 */}
                      <td>{dateStr}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ?�단 ?�약 ?�역 (�?주문 ??/ �?매출) */}
        {/* 관리자?�게 ?�체 매출�?주문?�을 빠르�?보여주는 ??�� */}
        <div className="order-summary">
          <div className="summary-item">
            <span className="summary-label">�?주문 ??</span>
            <span className="summary-value">{filteredOrders.length}�?/span>
          </div>
          <div className="summary-item">
            <span className="summary-label">�?매출??</span>
            <span className="summary-value">
              {filteredOrders
                .reduce((sum, o) => sum + (o.totalPrice || 0), 0)
                .toLocaleString()}
              ??
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;

