import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import reviewApi from '../../../api/reviewApi';
import StarRating from '../../common/StarRating';
import './ReviewItem.css';

const ReviewItem = ({ review, onEdit, onDelete, onImageClick }) => {
  const { user } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(review.content);
  const [editedRating, setEditedRating] = useState(review.rating || 5);

  const [deletedImageIds, setDeletedImageIds] = useState([]);

  // 좋아요 상태
  const [isLiked, setIsLiked] = useState(review.isLiked || false);
  const [likedCount, setLikedCount] = useState(review.likedCount || 0);

  // 작성자 여부
  const isAuthor =
    user &&
    (review.username === user.userId ||
      review.author === user.username ||
      review.author === user.userId);

  // 기존 이미지(id 함께)
  const [editingImages, setEditingImages] = useState(review.images || []);

  // 수정 모드에서 추가하는 이미지
  const [editImages, setEditImages] = useState([]); // {file, preview}

  const editFileInputRef = useRef(null);

  // 리뷰 변경 상태 초기화
  useEffect(() => {
    setIsLiked(review.isLiked || false);
    setLikedCount(review.likedCount ?? 0);
    setEditingImages(review.images || []);
    setEditedContent(review.content);
    setEditedRating(review.rating || 5);
  }, [review]);

  // URL 변환
  const getReviewImageUrl = (url) => {
    if (!url) return '/images/no-image.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
      return `http://localhost:8080${url.startsWith('/') ? '' : '/'}${url}`;
    }
    return url;
  };

  // 좋아요 클릭
  const handleLikeClick = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    try {
      const result = await reviewApi.toggleLike(review.id, user.id);
      if (result.success) {
        setIsLiked(result.data.isLiked);
        setLikedCount(result.data.likedCount);
      }
    } catch (error) {
      console.error("좋아요 오류:", error);
    }
  };

  // 기존 이미지 제거
  const handleRemoveExistingImage = (index) => {
    const removed = editingImages[index];
    if (removed?.id) {
      setDeletedImageIds((prev) => [...prev, removed.id]);
    }
    setEditingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 수정 이미지 추가
  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setEditImages((prev) => [...prev, ...mapped]);
  };

  // 수정 이미지 제거
  const handleRemoveEditImage = (index) => {
    setEditImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(review.content);
    setEditedRating(review.rating || 5);
    setEditingImages(review.images || []);
    setEditImages([]);
    setDeletedImageIds([]);
  };

  // 수정 저장
  const handleSaveEdit = async () => {
    if (!editedContent.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    const payload = {
      content: editedContent,
      rating: editedRating,
      deleteImageIds: deletedImageIds,
      newImages: editImages.map((x) => x.file),
    };

    try {
      await onEdit(review.id, payload);
      setIsEditing(false);
      setEditImages([]);
      setDeletedImageIds([]);
    } catch (error) {
      console.error("리뷰 수정 오류:", error);
    }
  };

  // 리뷰 삭제
  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await onDelete(review.id);
      } catch (error) {
        console.error("삭제 오류:", error);
      }
    }
  };

  const displayImages = isEditing ? editingImages : (review.images || []);

  return (
    <div className="review-item-wrapper">
      <div className="review-item">
        {isEditing ? (
          <div className="review-edit-form">
            <div className="rating-edit">
              <StarRating rating={editedRating} onRatingChange={setEditedRating} />
            </div>
            <textarea
              className="review-edit-textarea"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            {/* 이미지 미리보기 및 버튼 생략 (구조 유지) */}
            <div className="review-edit-actions">
              <button className="btn-save" onClick={handleSaveEdit}>저장</button>
              <button className="btn-cancel" onClick={handleCancelEdit}>취소</button>
            </div>
          </div>
        ) : (
          <>
            <div className="review-header">
              <div className="review-rating">{'★'.repeat(review.rating || 5)}</div>
              <div className="review-author">{review.author}</div>
              <div className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="review-content">{review.content}</div>
            <div className="review-footer">
              <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLikeClick}>
                <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
                <span className="like-count">{likedCount}</span>
              </button>
              {isAuthor && (
                <div className="review-actions">
                  <button className="btn-edit" onClick={handleEdit}>수정</button>
                  <button className="btn-delete" onClick={handleDelete}>삭제</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;