/**
 * ?¥ë°”êµ¬ë‹ˆ ?¬ì´???¨ë„ ì»´í¬?ŒíŠ¸
 *
 * ========================================
 * ?“Œ ì»´í¬?ŒíŠ¸ ê°œìš”
 * ========================================
 * - ?Œì¼ ?„ì¹˜: src/components/cart/CartSidePanel.js
 * - ??• : ?”ë©´ ?°ì¸¡?ì„œ ?¬ë¼?´ë“œ?˜ëŠ” ?¥ë°”êµ¬ë‹ˆ ë¯¸ë‹ˆ ?¨ë„
 * - ?¸ë¦¬ê±? CartFloatingButton ?´ë¦­ ???´ë¦¼
 *
 * ========================================
 * ?“Œ ì£¼ìš” ê¸°ëŠ¥
 * ========================================
 * 1. ?¥ë°”êµ¬ë‹ˆ ?„ì´??ëª©ë¡ ?œì‹œ
 * 2. ?˜ëŸ‰ ì¦ê?/ê°ì†Œ (+/- ë²„íŠ¼)
 * 3. ê°œë³„ ?„ì´???? œ
 * 4. ì´?ê¸ˆì•¡ ê³„ì‚° (? ì¸ê°€ ?ìš©)
 * 5. ?¥ë°”êµ¬ë‹ˆ ?˜ì´ì§€ë¡??´ë™
 *
 * ========================================
 * ?“Œ Props
 * ========================================
 * | propëª?      | ?€??      | ?¤ëª…                              |
 * |-------------|-----------|----------------------------------|
 * | isOpen      | boolean   | ?¨ë„ ?´ë¦¼/?«í˜ ?íƒœ                 |
 * | onClose     | function  | ?¨ë„ ?«ê¸° ì½œë°±                     |
 * | onCartUpdate| function  | ?¥ë°”êµ¬ë‹ˆ ë³€ê²???ë¶€ëª¨ì—ê²??Œë¦¼        |
 *
 * ========================================
 * ?“Œ ?°ë™ API (cartAPI)
 * ========================================
 * - getCartItems(): ?¥ë°”êµ¬ë‹ˆ ëª©ë¡ ì¡°íšŒ
 * - updateQuantity(cartItemId, quantity): ?˜ëŸ‰ ë³€ê²?
 * - removeItem(cartItemId): ?„ì´???? œ
 *
 * ========================================
 * ?“Œ UI êµ¬ì¡°
 * ========================================
 * ?Œâ??€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€??
 * ??[Header] ?¥ë°”êµ¬ë‹ˆ (3)    [?‘ê¸°][X] ??
 * ?œâ??€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€??
 * ???Œâ??€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€????
 * ????[?´ë?ì§€] ?í’ˆëª?             ????
 * ????         10,000????8,000??????
 * ????         ?˜ëŸ‰ [-] 2 [+]     ????
 * ????         ?Œê³„: 16,000??    ????
 * ???”â??€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€????
 * ???Œâ??€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€????
 * ????... ?¤ë¥¸ ?„ì´?œë“¤ ...        ????
 * ???”â??€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€????
 * ?œâ??€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€??
 * ??[Footer] ì´?ê¸ˆì•¡: 50,000??     ??
 * ??         [?¥ë°”êµ¬ë‹ˆ ê°€ê¸?         ??
 * ?”â??€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€??
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cartAPI } from "../../../api";
import "./CartSidePanel.css";

/**
 * CartSidePanel ì»´í¬?ŒíŠ¸
 *
 * props:
 * - isOpen: ?¨ë„ ?´ë¦¼ ?íƒœ
 * - onClose: ?«ê¸° ë²„íŠ¼ ?´ë¦­ ???¸ì¶œ?˜ëŠ” ì½œë°±
 * - onCartUpdate: ?¥ë°”êµ¬ë‹ˆ ë³€ê²???ë¶€ëª?ì»´í¬?ŒíŠ¸???Œë¦¬??ì½œë°±
 */
const CartSidePanel = ({ isOpen, onClose, onCartUpdate }) => {
  // React Router???„ë¡œê·¸ë˜ë§¤í‹± ?¤ë¹„ê²Œì´????
  const navigate = useNavigate();

  // ========================================
  // ?“Œ ?íƒœ (State) ?•ì˜
  // ========================================

  /**
   * ?¥ë°”êµ¬ë‹ˆ ?„ì´??ë°°ì—´
   * êµ¬ì¡°: [{ id, product: {...}, quantity }, ...]
   */
  const [cartItems, setCartItems] = useState([]);

  /**
   * API ë¡œë”© ì¤??¬ë?
   * true????"ë¡œë”© ì¤?.." ë©”ì‹œì§€ ?œì‹œ
   */
  const [loading, setLoading] = useState(false);

  /**
   * ?¨ë„ ìµœì†Œ???íƒœ (?„ì¬???¬ìš©?˜ì? ?Šê³  ?«ê¸°ë¡??€ì²?
   */
  const [isMinimized, setIsMinimized] = useState(false);

  // ========================================
  // ?“Œ Effect Hooks
  // ========================================

  /**
   * ?¨ë„???«í ??minimize ?íƒœ ì´ˆê¸°??
   *
   * ?˜ì¡´?? [isOpen]
   * - ?¨ë„???«íˆë©?isOpen: false) isMinimized??falseë¡?ë¦¬ì…‹
   * - ?¤ìŒ???´ë¦´ ????ƒ ?¼ì³ì§??íƒœë¡??œì‘
   */
  useEffect(() => {
    if (!isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen]);

  /**
   * ?¨ë„???´ë¦´ ???¥ë°”êµ¬ë‹ˆ ëª©ë¡ ë¡œë“œ
   *
   * ?˜ì¡´?? [isOpen]
   * - ?¨ë„???´ë¦¬ë©?isOpen: true) API ?¸ì¶œ?˜ì—¬ ìµœì‹  ?°ì´??ë¡œë“œ
   * - ë§¤ë²ˆ ?´ë¦´ ?Œë§ˆ???ˆë¡œ ì¡°íšŒ (?¤ì‹œê°??™ê¸°??
   */
  useEffect(() => {
    if (isOpen) {
      loadCartItems();
    }
  }, [isOpen]);

  // ========================================
  // ?“Œ API ?¸ì¶œ ?¨ìˆ˜
  // ========================================

  /**
   * ?¥ë°”êµ¬ë‹ˆ ëª©ë¡ ë¡œë“œ
   *
   * ì²˜ë¦¬ ?ë¦„:
   * 1. loading ?íƒœë¥?trueë¡??¤ì •
   * 2. cartAPI.getCartItems() ?¸ì¶œ
   * 3. ?±ê³µ ??cartItems ?íƒœ ?…ë°?´íŠ¸
   * 4. ?¤íŒ¨ ??ë¹?ë°°ì—´ë¡??¤ì •
   * 5. finally?ì„œ loading??falseë¡??¤ì •
   */
  const loadCartItems = async () => {
    setLoading(true);
    try {
      const response = await cartAPI.getCartItems();
      console.log("=== ?¥ë°”êµ¬ë‹ˆ API ?‘ë‹µ ===", response);

      if (response.success && response.data) {
        setCartItems(response.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("?¥ë°”êµ¬ë‹ˆ ì¡°íšŒ ?¤ë¥˜:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // ?“Œ ?´ë²¤???¸ë“¤??
  // ========================================

  /**
   * ?„ì´???? œ ?¸ë“¤??
   *
   * ì²˜ë¦¬ ?ë¦„:
   * 1. ?? œ ?•ì¸ ?¤ì´?¼ë¡œê·??œì‹œ
   * 2. ?•ì¸ ??cartAPI.removeItem() ?¸ì¶œ
   * 3. ?±ê³µ ??ëª©ë¡ ?ˆë¡œê³ ì¹¨ + ë¶€ëª¨ì—ê²??Œë¦¼
   * 4. ?¤íŒ¨ ???ëŸ¬ ?Œë¦¼
   *
   * cartItemId: ?? œ???¥ë°”êµ¬ë‹ˆ ?„ì´?œì˜ PK
   */
  const handleRemoveItem = async (cartItemId) => {
    // ?? œ ?•ì¸ (ì·¨ì†Œ ???¨ìˆ˜ ì¢…ë£Œ)
    if (!window.confirm("???í’ˆ???¥ë°”êµ¬ë‹ˆ?ì„œ ?? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?")) {
      return;
    }

    try {
      const response = await cartAPI.removeItem(cartItemId);
      if (response.success) {
        // ?? œ ?±ê³µ: ëª©ë¡ ?ˆë¡œê³ ì¹¨
        await loadCartItems();
        // ë¶€ëª?ì»´í¬?ŒíŠ¸??ë³€ê²??Œë¦¼ (ë°°ì? ?«ì ê°±ì‹ ??
        if (onCartUpdate) onCartUpdate();
      } else {
        alert(response.message || "?? œ???¤íŒ¨?ˆìŠµ?ˆë‹¤.");
      }
    } catch (error) {
      console.error("?? œ ?¤ë¥˜:", error);
      alert("?? œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.");
    }
  };

  /**
   * ?˜ëŸ‰ ë³€ê²??¸ë“¤??
   *
   * ì²˜ë¦¬ ?ë¦„:
   * 1. ???˜ëŸ‰ ê³„ì‚° (?„ì¬ ?˜ëŸ‰ + ë³€ê²½ê°’)
   * 2. 1 ë¯¸ë§Œ?´ë©´ ê²½ê³  ??ì¢…ë£Œ
   * 3. cartAPI.updateQuantity() ?¸ì¶œ
   * 4. ?±ê³µ ??ëª©ë¡ ?ˆë¡œê³ ì¹¨ + ë¶€ëª¨ì—ê²??Œë¦¼
   *
   * cartItemId: ?¥ë°”êµ¬ë‹ˆ ?„ì´??PK
   * currentQuantity: ?„ì¬ ?˜ëŸ‰
   * change: ë³€ê²½ê°’ (+1 ?ëŠ” -1)
   */
  const handleQuantityChange = async (cartItemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;

    // ìµœì†Œ ?˜ëŸ‰ ì²´í¬
    if (newQuantity < 1) {
      alert("?˜ëŸ‰?€ 1ê°??´ìƒ?´ì–´???©ë‹ˆ??");
      return;
    }

    try {
      const response = await cartAPI.updateQuantity(cartItemId, newQuantity);
      if (response.success) {
        // ?˜ëŸ‰ ë³€ê²??±ê³µ: ëª©ë¡ ?ˆë¡œê³ ì¹¨
        await loadCartItems();
        // ë¶€ëª?ì»´í¬?ŒíŠ¸??ë³€ê²??Œë¦¼
        if (onCartUpdate) onCartUpdate();
      } else {
        alert(response.message || "?˜ëŸ‰ ë³€ê²½ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.");
      }
    } catch (error) {
      console.error("?˜ëŸ‰ ë³€ê²??¤ë¥˜:", error);
      alert("?˜ëŸ‰ ë³€ê²?ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.");
    }
  };

  /**
   * ?‘ê¸° ë²„íŠ¼ ?¸ë“¤??
   * ?„ì¬??ìµœì†Œ???€???„ì „???«ê¸°ë¡??™ì‘
   */
  const toggleMinimize = () => {
    onClose();  // ?‘ê¸° ë²„íŠ¼???´ë¦­?˜ë©´ ?„ì „???«ê¸°
  };

  /**
   * ?¤ë²„?ˆì´ ?´ë¦­ ?¸ë“¤??
   * ?¨ë„ ë°”ê¹¥ ?ì—­(?´ë‘??ë¶€ë¶? ?´ë¦­ ???¨ë„ ?«ê¸°
   */
  const handleOverlayClick = () => {
    if (!isMinimized) {
      onClose();
    }
  };

  /**
   * ?¥ë°”êµ¬ë‹ˆ ?˜ì´ì§€ë¡??´ë™
   * "?¥ë°”êµ¬ë‹ˆ ê°€ê¸? ë²„íŠ¼ ?´ë¦­ ???¸ì¶œ
   */
  const handleGoToCart = () => {
    navigate("/cart");  // ?¥ë°”êµ¬ë‹ˆ ?˜ì´ì§€ë¡??¼ìš°??
    onClose();          // ?¨ë„ ?«ê¸°
  };

  // ========================================
  // ?“Œ ? í‹¸ë¦¬í‹° ?¨ìˆ˜
  // ========================================

  /**
   * ê°€ê²??¬ë§·??(ì²??¨ìœ„ ì½¤ë§ˆ)
   *
   * ?ˆì‹œ:
   * - formatPrice(10000) ??"10,000"
   * - formatPrice(null) ??"0"
   *
   * price: ?«ì ?ëŠ” null/undefined
   * return: ?¬ë§·?…ëœ ë¬¸ì??
   */
  const formatPrice = (price) => {
    if (!price) return "0";
    return price.toLocaleString();
  };

  /**
   * ? ì¸??ê³„ì‚°
   *
   * ê³µì‹: ((?•ê? - ? ì¸ê°€) / ?•ê?) Ã— 100
   *
   * ?ˆì‹œ:
   * - calculateDiscountRate(10000, 8000) ??20
   * - calculateDiscountRate(10000, null) ??0
   *
   * originalPrice: ?•ê?
   * salePrice: ? ì¸ê°€
   * return: ? ì¸??(?•ìˆ˜, %)
   */
  const calculateDiscountRate = (originalPrice, salePrice) => {
    // ? íš¨?˜ì? ?Šì? ê²½ìš° 0 ë°˜í™˜
    if (!originalPrice || !salePrice || salePrice >= originalPrice) return 0;
    // ?Œìˆ˜??ë°˜ì˜¬ë¦¼í•˜???•ìˆ˜ë¡?ë°˜í™˜
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  /**
   * ?í’ˆ ?´ë?ì§€ URL ?ì„±
   *
   * ?¤ì–‘???´ë?ì§€ ê²½ë¡œ ?•ì‹??ì²˜ë¦¬:
   * 1. ?„ì „??URL (http://, https://) ??ê·¸ë?ë¡??¬ìš©
   * 2. uploads/ ê²½ë¡œ ??ë°±ì—”??URL ë¶™ì´ê¸?
   * 3. ?Œì¼ëª…ë§Œ ?ˆëŠ” ê²½ìš° ??/product_img/{name}.jpg
   * 4. ?´ë?ì§€ ?†ìŒ ??ê¸°ë³¸ ?´ë?ì§€
   *
   * product: ?í’ˆ ê°ì²´
   * return: ?´ë?ì§€ URL ë¬¸ì??
   */
  const getImageUrl = (product) => {
    // ?´ë?ì§€ ê²½ë¡œ ì¶”ì¶œ (?°ì„ ?œìœ„: thumbnailImage > imageUrl > mainImage)
    let imagePath =
      product?.thumbnailImage || product?.imageUrl || product?.mainImage;

    // ?´ë?ì§€ ê²½ë¡œê°€ ?†ìœ¼ë©?ê¸°ë³¸ ?´ë?ì§€ ë°˜í™˜
    if (!imagePath) {
      return "/images/no-image.png";
    }

    // Case 1: ?„ì „??URL??ê²½ìš° ê·¸ë?ë¡?ë°˜í™˜
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Case 2: uploads ?´ë” ê²½ë¡œ??ê²½ìš° ë°±ì—”??URL ë¶™ì´ê¸?
    if (imagePath.startsWith("uploads/") || imagePath.startsWith("/uploads/")) {
      return `http://localhost:8080${
        imagePath.startsWith("/") ? "" : "/"
      }${imagePath}`;
    }

    // Case 3: ?Œì¼ëª…ë§Œ ?ˆëŠ” ê²½ìš° (?•ì¥???†ì´)
    // ?? "product001" ??"/product_img/product001.jpg"
    if (!imagePath.includes("/") && !imagePath.startsWith("http")) {
      return `/product_img/${imagePath}.jpg`;
    }
  
    // ê·??¸ì˜ ê²½ìš° ê·¸ë?ë¡?ë°˜í™˜
    return imagePath;
  };

  /**
   * ì´?ê¸ˆì•¡ ê³„ì‚°
   *
   * ëª¨ë“  ?„ì´?œì˜ (ìµœì¢…ê°€ê²?Ã— ?˜ëŸ‰) ?©ê³„
   * ? ì¸ê°€ê°€ ?ˆìœ¼ë©?? ì¸ê°€, ?†ìœ¼ë©??•ê? ?¬ìš©
   *
   * return: ì´?ê¸ˆì•¡ (?«ì)
   */
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const originalPrice = item.product?.price || 0;
      const salePrice = item.product?.salePrice || 0;
      // ? ì¸ê°€ê°€ 0ë³´ë‹¤ ?¬ë©´ ? ì¸ê°€ ?¬ìš©, ?„ë‹ˆë©??•ê? ?¬ìš©
      const finalPrice = salePrice > 0 ? salePrice : originalPrice;
      return total + finalPrice * (item.quantity || 0);
    }, 0);
  };

  // ========================================
  // ?“Œ ?Œë”ë§?
  // ========================================

  // ?¨ë„???«í??ˆìœ¼ë©??„ë¬´ê²ƒë„ ?Œë”ë§í•˜ì§€ ?ŠìŒ
  if (!isOpen) return null;

  return (
    <>
      {/* ========================================
          ?¤ë²„?ˆì´ (ë°°ê²½ ?´ë‘¡ê²?
          - ?¨ë„???´ë ¤?ˆê³  ìµœì†Œ?”ë˜ì§€ ?Šì•˜???Œë§Œ ?œì‹œ
          - ?´ë¦­ ???¨ë„ ?«ê¸°
          ======================================== */}
      {!isMinimized && (
        <div
          className={`cart-overlay ${isOpen ? "active" : ""}`}
          onClick={handleOverlayClick}
        />
      )}

      {/* ========================================
          ?¬ì´???¨ë„ ë³¸ì²´
          - active ?´ë˜?? ?¬ë¼?´ë“œ ??? ë‹ˆë©”ì´??
          - minimized ?´ë˜?? ìµœì†Œ???íƒœ ?¤í???
          ======================================== */}
      <div
        className={`cart-side-panel ${isOpen ? "active" : ""} ${
          isMinimized ? "minimized" : ""
        }`}
      >
        {/* ========================================
            ?¤ë” ?ì—­
            - ?œëª© + ?„ì´??ê°œìˆ˜
            - ?‘ê¸°/?«ê¸° ë²„íŠ¼
            ======================================== */}
        <div className="cart-panel-header">
          <div className="cart-header-left">
            <h2>?¥ë°”êµ¬ë‹ˆ ({cartItems.length})</h2>
            <button className="minimize-btn" onClick={toggleMinimize}>
              {isMinimized ? "?¼ì¹˜ê¸? : "?‘ê¸°"}
            </button>
          </div>
          <button className="close-btn" onClick={onClose}>
            ??
          </button>
        </div>

        {/* ========================================
            ì½˜í…ì¸??ì—­ (?„ì´??ëª©ë¡)
            - ìµœì†Œ???íƒœê°€ ?„ë‹ ?Œë§Œ ?œì‹œ
            - ë¡œë”© ì¤?/ ë¹??¥ë°”êµ¬ë‹ˆ / ?„ì´??ëª©ë¡ ë¶„ê¸°
            ======================================== */}
        {!isMinimized && (
          <div className="cart-panel-content">
            {loading ? (
              // ë¡œë”© ?íƒœ
              <div className="loading-cart">
                <p>ë¡œë”© ì¤?..</p>
              </div>
            ) : cartItems.length === 0 ? (
              // ë¹??¥ë°”êµ¬ë‹ˆ
              <div className="empty-cart">
                <p>?¥ë°”êµ¬ë‹ˆê°€ ë¹„ì–´?ˆìŠµ?ˆë‹¤.</p>
              </div>
            ) : (
              // ?„ì´??ëª©ë¡
              <div className="cart-items-list">
                {cartItems.map((item) => {
                  // ?í’ˆ ?•ë³´ ì¶”ì¶œ (?ˆì „?˜ê²Œ ê¸°ë³¸ê°??¤ì •)
                  const product = item.product || {};
                  const originalPrice = product.price || 0;
                  const salePrice = product.salePrice || 0;
                  const finalPrice = salePrice > 0 ? salePrice : originalPrice;
                  const discountRate = calculateDiscountRate(
                    originalPrice,
                    salePrice
                  );
                  const quantity = item.quantity || 0;
                  const itemTotal = finalPrice * quantity;
                  const productName = product.name || "?í’ˆëª??†ìŒ";

                  return (
                    <div key={item.id} className="cart-item-card">
                      {/* ?? œ ë²„íŠ¼ (?°ì¸¡ ?ë‹¨ X) */}
                      <button
                        className="remove-item-btn"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        ??
                      </button>

                      {/* ?í’ˆ ?´ë?ì§€ */}
                      <div className="item-image">
                        <img
                          src={getImageUrl(product)}
                          alt={productName}
                          onError={(e) => {
                            // ?´ë?ì§€ ë¡œë“œ ?¤íŒ¨ ??ê¸°ë³¸ ?´ë?ì§€ë¡??€ì²?
                            e.target.src = "/images/no-image.png";
                          }}
                        />
                      </div>

                      {/* ?í’ˆ ?•ë³´ */}
                      <div className="item-info">
                        <h3 className="item-name">{productName}</h3>

                        {/* ê°€ê²??œì‹œ ?ì—­ */}
                        <div className="item-price-container">
                          {discountRate > 0 ? (
                            // ? ì¸ ?í’ˆ??ê²½ìš°
                            <>
                              <div className="original-price">
                                {formatPrice(originalPrice)}??
                              </div>
                              <div className="sale-price-row">
                                <span className="sale-price">
                                  {formatPrice(salePrice)}??
                                </span>
                                <span className="discount-badge">
                                  {discountRate}% ? ì¸
                                </span>
                              </div>
                            </>
                          ) : (
                            // ? ì¸ ?†ëŠ” ê²½ìš°
                            <div className="item-price">
                              {formatPrice(originalPrice)}??
                            </div>
                          )}
                        </div>

                        {/* ?˜ëŸ‰ ë°??Œê³„ */}
                        <div className="item-details">
                          {/* ?˜ëŸ‰ ì¡°ì ˆ ë²„íŠ¼ */}
                          <div className="item-quantity-control">
                            <span className="label">?˜ëŸ‰</span>
                            <div className="quantity-buttons">
                              <button
                                className="quantity-btn minus"
                                onClick={() =>
                                  handleQuantityChange(item.id, quantity, -1)
                                }
                                disabled={quantity <= 1}
                              >
                                ??
                              </button>
                              <span className="quantity-value">{quantity}</span>
                              <button
                                className="quantity-btn plus"
                                onClick={() =>
                                  handleQuantityChange(item.id, quantity, 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* ?Œê³„ (?„ì´?œë³„ ê¸ˆì•¡) */}
                          <div className="item-subtotal">
                            <span className="label">?Œê³„</span>
                            <strong>{formatPrice(itemTotal)}??/strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================
            ?¸í„° ?ì—­
            - ì´?ê¸ˆì•¡ ?œì‹œ
            - ?¥ë°”êµ¬ë‹ˆ ê°€ê¸?ë²„íŠ¼
            - ìµœì†Œ???íƒœê°€ ?„ë‹ ?Œë§Œ ?œì‹œ
            ======================================== */}
        {!isMinimized && (
          <div className="cart-panel-footer">
            <div className="total-price">
              <span>ì´?ê¸ˆì•¡</span>
              <strong>{formatPrice(getTotalPrice())}??/strong>
            </div>
            <button
              className="go-to-cart-btn"
              onClick={handleGoToCart}
              disabled={cartItems.length === 0}
            >
              ?¥ë°”êµ¬ë‹ˆ ê°€ê¸?
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidePanel;


/*
 * ========================================
 * ?“Œ ì»´í¬?ŒíŠ¸ ?í˜¸?‘ìš© ?ë¦„
 * ========================================
 *
 * [CartFloatingButton.js]
 *        ??
 *        ???´ë¦­: setIsPanelOpen(true)
 *        ??
 * [CartSidePanel.js]
 *        ??
 *        ?œâ??€ isOpen=true ??useEffect ?¸ë¦¬ê±?
 *        ??                       ??
 *        ??                       ??
 *        ??              loadCartItems()
 *        ??                       ??
 *        ??                       ??
 *        ??              cartAPI.getCartItems()
 *        ??                       ??
 *        ??                       ??
 *        ??              setCartItems(response.data)
 *        ??                       ??
 *        ??                       ??
 *        ??              UI ?Œë”ë§?(?„ì´??ëª©ë¡)
 *        ??
 *        ?œâ??€ ?˜ëŸ‰ ë³€ê²?ë²„íŠ¼ ?´ë¦­
 *        ??       ??
 *        ??       ??
 *        ??  handleQuantityChange()
 *        ??       ??
 *        ??       ??
 *        ??  cartAPI.updateQuantity()
 *        ??       ??
 *        ??       ??
 *        ??  loadCartItems() ??UI ê°±ì‹ 
 *        ??       ??
 *        ??       ??
 *        ??  onCartUpdate() ??ë¶€ëª?ì»´í¬?ŒíŠ¸ ?Œë¦¼
 *        ??
 *        ?œâ??€ ?? œ ë²„íŠ¼ ?´ë¦­
 *        ??       ??
 *        ??       ??
 *        ??  handleRemoveItem()
 *        ??       ??
 *        ??       ??
 *        ??  confirm() ??cartAPI.removeItem()
 *        ??       ??
 *        ??       ??
 *        ??  loadCartItems() ??UI ê°±ì‹ 
 *        ??
 *        ?”â??€ ?¥ë°”êµ¬ë‹ˆ ê°€ê¸?ë²„íŠ¼ ?´ë¦­
 *                 ??
 *                 ??
 *            navigate("/cart") + onClose()
 *
 *
 * ========================================
 * ?“Œ CSS ?´ë˜??êµ¬ì¡°
 * ========================================
 *
 * .cart-overlay          - ë°°ê²½ ?¤ë²„?ˆì´ (ë°˜íˆ¬ëª?ê²€??
 *   ?”â??€ .active          - ?œì‹œ ?íƒœ
 *
 * .cart-side-panel       - ?¨ë„ ì»¨í…Œ?´ë„ˆ
 *   ?œâ??€ .active          - ?¬ë¼?´ë“œ ???íƒœ
 *   ?œâ??€ .minimized       - ìµœì†Œ???íƒœ
 *   ??
 *   ?œâ??€ .cart-panel-header   - ?¤ë”
 *   ??  ?œâ??€ .cart-header-left
 *   ??  ??  ?œâ??€ h2           - ?œëª© + ê°œìˆ˜
 *   ??  ??  ?”â??€ .minimize-btn - ?‘ê¸° ë²„íŠ¼
 *   ??  ?”â??€ .close-btn       - ?«ê¸° ë²„íŠ¼
 *   ??
 *   ?œâ??€ .cart-panel-content  - ì½˜í…ì¸??ì—­
 *   ??  ?œâ??€ .loading-cart    - ë¡œë”© ?íƒœ
 *   ??  ?œâ??€ .empty-cart      - ë¹??¥ë°”êµ¬ë‹ˆ
 *   ??  ?”â??€ .cart-items-list - ?„ì´??ëª©ë¡
 *   ??      ?”â??€ .cart-item-card  - ê°œë³„ ?„ì´??
 *   ??          ?œâ??€ .remove-item-btn   - ?? œ ë²„íŠ¼
 *   ??          ?œâ??€ .item-image        - ?´ë?ì§€
 *   ??          ?”â??€ .item-info         - ?•ë³´
 *   ??              ?œâ??€ .item-name     - ?í’ˆëª?
 *   ??              ?œâ??€ .item-price-container - ê°€ê²?
 *   ??              ??  ?œâ??€ .original-price   - ?•ê?
 *   ??              ??  ?œâ??€ .sale-price       - ? ì¸ê°€
 *   ??              ??  ?”â??€ .discount-badge   - ? ì¸??
 *   ??              ?”â??€ .item-details  - ?˜ëŸ‰/?Œê³„
 *   ??                  ?œâ??€ .item-quantity-control
 *   ??                  ?”â??€ .item-subtotal
 *   ??
 *   ?”â??€ .cart-panel-footer   - ?¸í„°
 *       ?œâ??€ .total-price     - ì´?ê¸ˆì•¡
 *       ?”â??€ .go-to-cart-btn  - ?´ë™ ë²„íŠ¼
 *
 *
 * ========================================
 * ?“Œ ?´ë?ì§€ URL ì²˜ë¦¬ ì¼€?´ìŠ¤
 * ========================================
 *
 * ?Œâ??€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€??
 * ???…ë ¥ê°?                       ??ì¶œë ¥ê°?                            ??
 * ?œâ??€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?¼â??€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€??
 * ??null / undefined             ??/images/no-image.png              ??
 * ??https://example.com/img.jpg  ??https://example.com/img.jpg       ??
 * ??uploads/product/img.jpg      ??http://localhost:8080/uploads/... ??
 * ??/uploads/product/img.jpg     ??http://localhost:8080/uploads/... ??
 * ??product001                   ??/product_img/product001.jpg       ??
 * ?”â??€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?´â??€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€??
 *
 */

