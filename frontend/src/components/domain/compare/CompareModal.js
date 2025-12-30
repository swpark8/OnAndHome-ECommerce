import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCompare,
  clearCompare,
} from "../../../store/slices/compareSlice";
import CompareSelectModal from "./CompareSelectModal";
import "./CompareModal.css";

const CompareModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const compareItems = useSelector((state) => state.compare.items);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCompare(productId));
  };

  const handleClearAll = () => {
    if (window.confirm("ëª¨ë“  ë¹„êµ ?í’ˆ???? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?")) {
      dispatch(clearCompare());
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleOverlayClick = () => {
    if (!isMinimized) {
      onClose();
    }
  };

  const handleAddProduct = () => {
    if (compareItems.length >= 4) {
      alert("ìµœë? 4ê°??í’ˆê¹Œì? ë¹„êµ?????ˆìŠµ?ˆë‹¤.");
      return;
    }
    setIsSelectModalOpen(true);
  };

  const formatPrice = (price) => {
    if (!price) return "0";
    return price.toLocaleString();
  };

  const getImageUrl = (imagePath) => {
    console.log("?ë³¸ imagePath:", imagePath);

    if (!imagePath) return "/images/no-image.png";

    // uploads/ ê²½ë¡œë©?ë°±ì—”???œë²„?ì„œ ê°€?¸ì˜¤ê¸?
    if (imagePath.startsWith("uploads/") || imagePath.startsWith("/uploads/")) {
      return `http://localhost:8080${
        imagePath.startsWith("/") ? "" : "/"
      }${imagePath}`;
    }

    // ì§§ì? ?´ë¦„?´ë©´ public/product_img/ ?´ë”?ì„œ ê°€?¸ì˜¤ê¸?
    if (!imagePath.includes("/") && !imagePath.startsWith("http")) {
      return `/product_img/${imagePath}.jpg`;
    }

    return imagePath;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ?¤ë²„?ˆì´ - ?‘í˜”???ŒëŠ” ?œì‹œ ????*/}
      {!isMinimized && (
        <div
          className={`compare-overlay ${isOpen ? "active" : ""}`}
          onClick={handleOverlayClick}
        />
      )}

      {/* ë¹„êµ ëª¨ë‹¬ */}
      <div
        className={`compare-modal ${isOpen ? "active" : ""} ${
          isMinimized ? "minimized" : ""
        }`}
      >
        {/* ?¤ë” */}
        <div className="compare-modal-header">
          <div className="compare-header-left">
            <h2>?í’ˆ ë¹„êµ ({compareItems.length}/4)</h2>
            <button className="minimize-btn" onClick={toggleMinimize}>
              {isMinimized ? "?¼ì¹˜ê¸? : "?‘ê¸°"}
            </button>
          </div>
          <div className="compare-header-right">
            {!isMinimized && compareItems.length > 0 && (
              <button className="clear-all-btn" onClick={handleClearAll}>
                ?„ì²´ ?? œ
              </button>
            )}
            <button className="close-btn" onClick={onClose}>
              ??
            </button>
          </div>
        </div>

        {/* ë¹„êµ ?í’ˆ ëª©ë¡ */}
        {!isMinimized && (
          <div className="compare-modal-content">
            <div className="compare-products-grid">
              {/* ë¹„êµ ?í’ˆ ì¹´ë“œ??*/}
              {compareItems.map((product) => (
                <div key={product.id} className="compare-product-card">
                  <button
                    className="remove-product-btn"
                    onClick={() => handleRemoveItem(product.id)}
                  >
                    ??
                  </button>
                  <div className="compare-product-image">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = "/images/placeholder.png";
                      }}
                    />
                  </div>
                  <div className="compare-product-info">
                    <h3>{product.name}</h3>
                    <p className="compare-product-price">
                      {formatPrice(product.price)}??
                    </p>
                  </div>
                  <div className="compare-product-specs">
                    <div className="spec-item">
                      <span className="spec-label">ì¹´í…Œê³ ë¦¬</span>
                      <span className="spec-value">
                        {product.category || "-"}
                      </span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">ë¸Œëœ??/span>
                      <span className="spec-value">{product.brand || "-"}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">?¬ê³ </span>
                      <span className="spec-value">{product.stock || 0}ê°?/span>
                    </div>
                  </div>
                </div>
              ))}

              {/* ë¹??¬ë¡¯ */}
              {[...Array(4 - compareItems.length)].map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="compare-product-card empty"
                  onClick={handleAddProduct}
                  style={{ cursor: "pointer" }}
                >
                  <div className="empty-slot">
                    <span className="plus-icon">+</span>
                    <p>ë¹„êµ?˜ê³  ?¶ì? ?œí’ˆ??ìµœë? 4ê°œê¹Œì§€ ? íƒ?´ì£¼?¸ìš”.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ?í’ˆ ? íƒ ëª¨ë‹¬ */}
      <CompareSelectModal
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
      />
    </>
  );
};

export default CompareModal;

