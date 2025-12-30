import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./QnaItem.css";

const QnaItem = ({ qna, onEdit, onDelete }) => {
  const { user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(qna.title || "?ÅÌíà Î¨∏Ïùò");
  const [editedQuestion, setEditedQuestion] = useState(qna.question);
  const [editedIsPrivate, setEditedIsPrivate] = useState(
    qna.isPrivate || false
  );

  // ?îÎ≤ÑÍπ?Î°úÍ∑∏
  useEffect(() => {
    console.log("=== QnaItem ?îÎ≤ÑÍπ?===");
    console.log("QnA ?ÑÏ≤¥ ?∞Ïù¥??", qna);
    console.log("isPrivate Í∞?", qna.isPrivate);
    console.log("isPrivate ?Ä??", typeof qna.isPrivate);
    console.log("Î°úÍ∑∏???¨Ïö©??", user);
    console.log("QnA ?ëÏÑ±??", qna.writer);
    console.log("?¨Ïö©??ID:", user?.userId);
    console.log("?¨Ïö©???¥Î¶Ñ:", user?.username);
    console.log("?¨Ïö©??role:", user?.role);
  }, [qna, user]);

  // ?ÑÏû¨ Î°úÍ∑∏?∏Ìïú ?¨Ïö©?êÍ? ?ëÏÑ±?êÏù∏ÏßÄ ?ïÏù∏
  const isAuthor =
    user && (qna.writer === user.userId || qna.writer === user.username);

  // Í¥ÄÎ¶¨Ïûê?∏Ï? ?ïÏù∏
  const isAdmin =
    user && (user.role === 0 || user.role === "0" || Number(user.role) === 0);

  // ÎπÑÎ?Í∏Ä?∏Ï? ?ïÏù∏
  const isPrivatePost = qna.isPrivate === true;

  // ÎπÑÎ?Í∏Ä ?¥Îûå Í∂åÌïú Ï≤¥ÌÅ¨
  const canView = !isPrivatePost || isAuthor || isAdmin;

  console.log("isAuthor:", isAuthor);
  console.log("isAdmin:", isAdmin);
  console.log("isPrivatePost:", isPrivatePost);
  console.log("canView:", canView);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(qna.title || "?ÅÌíà Î¨∏Ïùò");
    setEditedQuestion(qna.question);
    setEditedIsPrivate(qna.isPrivate || false);
  };

  const handleSaveEdit = async () => {
    if (!editedQuestion.trim()) {
      alert("Î¨∏Ïùò ?¥Ïö©???ÖÎ†•?¥Ï£º?∏Ïöî.");
      return;
    }

    try {
      await onEdit(qna.id, {
        title: editedTitle,
        question: editedQuestion,
        isPrivate: editedIsPrivate,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("QnA ?òÏ†ï ?§Î•ò:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("?ïÎßê ??Î¨∏ÏùòÎ•???†ú?òÏãúÍ≤†Ïäµ?àÍπå?")) {
      try {
        await onDelete(qna.id);
      } catch (error) {
        console.error("QnA ??†ú ?§Î•ò:", error);
      }
    }
  };

  return (
    <div className="qna-item-wrapper">
      <div className="qna-item">
        {isEditing ? (
          <div className="qna-edit-form">
            <input
              type="text"
              className="qna-edit-title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="?úÎ™©???ÖÎ†•?òÏÑ∏??
            />
            <textarea
              className="qna-edit-textarea"
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              placeholder="Î¨∏Ïùò ?¥Ïö©???ÖÎ†•?òÏÑ∏??
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={editedIsPrivate}
                onChange={(e) => setEditedIsPrivate(e.target.checked)}
              />
              <span>ÎπÑÎ?Í∏ÄÎ°??ëÏÑ±</span>
            </label>
            <div className="qna-edit-actions">
              <button onClick={handleSaveEdit} className="btn-save">
                ?Ä??
              </button>
              <button onClick={handleCancelEdit} className="btn-cancel">
                Ï∑®ÏÜå
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="qna-header">
              <span className="qna-badge">Q</span>
              {isPrivatePost && (
                <span
                  className="private-badge"
                  style={{ fontSize: "18px", marginLeft: "8px" }}
                >
                  ?îí
                </span>
              )}
              <span className="qna-title">{qna.title || "?ÅÌíà Î¨∏Ïùò"}</span>
              <div className="qna-info">
                <span className="qna-author">{qna.writer || "?µÎ™Ö"}</span>
                {qna.createdAt && (
                  <span className="qna-date">
                    {new Date(qna.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {canView ? (
              <>
                <div className="qna-question">{qna.question}</div>
                {isAuthor && (
                  <div className="qna-actions">
                    <button onClick={handleEdit} className="btn-edit">
                      ?òÏ†ï
                    </button>
                    <button onClick={handleDelete} className="btn-delete">
                      ??†ú
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="private-message">
                ?îí ÎπÑÎ?Í∏Ä?ÖÎãà?? ?ëÏÑ±?êÎßå ?ïÏù∏?????àÏäµ?àÎã§.
              </div>
            )}
          </>
        )}
      </div>

      {/* ?µÎ? ?úÏãú */}
      {qna.replies && qna.replies.length > 0 && !isEditing && canView && (
        <div className="qna-replies">
          {qna.replies.map((reply, index) => (
            <div key={index} className="qna-reply">
              <span className="reply-badge">A</span>
              <div className="reply-content">
                <div className="reply-text">{reply.content}</div>
                <div className="reply-info">
                  <span className="reply-author">
                    {reply.responder || "Í¥ÄÎ¶¨Ïûê"}
                  </span>
                  {reply.createdAt && (
                    <span className="reply-date">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QnaItem;

