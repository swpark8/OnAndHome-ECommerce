import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCompare,
  removeFromCompare,
} from "../../../store/slices/compareSlice";
import { favoriteAPI } from "../../../api/favoriteApi";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const compareItems = useSelector((state) => state.compare.items);
  
  const productId = product.id || product.productId;
  const isInCompare = compareItems.some((item) => item.id === productId);

  // Ï∞??ÅÌÉú Í¥ÄÎ¶?
  const [isFavorite, setIsFavorite] = useState(false);

  // Ï¥àÍ∏∞ Ï∞??ÅÌÉú ?ïÏù∏
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await favoriteAPI.check(productId);
        if (response.success) {
          setIsFavorite(response.isFavorite);
        }
      } catch (error) {
        console.error("Ï∞??ÅÌÉú ?ïÏù∏ ?§Î•ò:", error);
      }
    };

    if (productId) {
      checkFavoriteStatus();
    }
  }, [productId]);

  const handleClick = () => {
    navigate(`/products/${productId}`);
  };

  const handleCompareToggle = (e) => {
    e.stopPropagation(); // Ïπ¥Îìú ?¥Î¶≠ ?¥Î≤§??Î∞©Ï?

    if (isInCompare) {
      dispatch(removeFromCompare(productId));
    } else {
      if (compareItems.length >= 4) {
        alert("ÏµúÎ? 4Í∞??ÅÌíàÍπåÏ? ÎπÑÍµê?????àÏäµ?àÎã§.");
        return;
      }
      // ÎπÑÍµê?òÍ∏∞???Ä?•Ìï† ?∞Ïù¥???ïÍ∑ú??
      const compareProduct = {
        ...product,
        id: productId,
        image: product.thumbnailImage || product.image || product.mainImg
      };
      dispatch(addToCompare(compareProduct));
    }
  };

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation(); // Ïπ¥Îìú ?¥Î¶≠ ?¥Î≤§??Î∞©Ï?

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Î°úÍ∑∏?∏Ïù¥ ?ÑÏöî?©Îãà??");
      navigate("/login");
      return;
    }

    try {
      const response = await favoriteAPI.toggle(productId);
      if (response.success) {
        setIsFavorite(response.isFavorite);
      }
    } catch (error) {
      console.error("Ï∞úÌïòÍ∏??§Î•ò:", error);
      alert("Ï∞úÌïòÍ∏?Ï≤òÎ¶¨ Ï§??§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§.");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/no-image.png";

    // uploads/ Í≤ΩÎ°úÎ©?Î∞±Ïóî???úÎ≤Ñ?êÏÑú Í∞Ä?∏Ïò§Í∏?
    if (imagePath.startsWith("uploads/") || imagePath.startsWith("/uploads/")) {
      return `http://localhost:8080${
        imagePath.startsWith("/") ? "" : "/"
      }${imagePath}`;
    }

    // ÏßßÏ? ?¥Î¶Ñ?¥Î©¥ public/product_img/ ?¥Îçî?êÏÑú Í∞Ä?∏Ïò§Í∏?
    if (!imagePath.includes("/") && !imagePath.startsWith("http")) {
      return `/product_img/${imagePath}.jpg`;
    }

    return imagePath;
  };

  // ?¥Î?ÏßÄ ?ÑÎìú ?∞ÏÑ†?úÏúÑ: thumbnailImage > image > mainImg
  const imageSource = product.thumbnailImage || product.image || product.mainImg;

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image-wrapper">
        <img
          src={getImageUrl(imageSource)}
          alt={product.name || product.productName}
          className="product-image"
          onError={(e) => {
            e.target.src = "/images/placeholder.png";
            e.target.onerror = null;
          }}
        />

        {/* Ï∞úÌïòÍ∏?Î≤ÑÌäº */}
        <button
          className={`favorite-btn-card ${isFavorite ? "active" : ""}`}
          onClick={handleFavoriteToggle}
          title={isFavorite ? "Ï∞?Ï∑®ÏÜå" : "Ï∞úÌïòÍ∏?}
        >
          <svg
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* ÎπÑÍµê Î≤ÑÌäº */}
        <button
          className={`compare-btn ${isInCompare ? "active" : ""}`}
          onClick={handleCompareToggle}
          title={isInCompare ? "ÎπÑÍµê Ï∑®ÏÜå" : "ÎπÑÍµê?òÍ∏∞"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
          </svg>
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name || product.productName}</h3>
        <p className="product-price">{(product.price || product.salePrice)?.toLocaleString()}??/p>
      </div>
    </div>
  );
};

export default ProductCard;

