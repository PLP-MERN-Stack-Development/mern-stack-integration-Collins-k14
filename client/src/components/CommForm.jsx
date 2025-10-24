import { useState } from 'react';
import { postService } from '../services/api';

export default function CommentForm({ postId, onCommentAdded }) {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newComment = await postService.addComment(postId, { content: comment });
      onCommentAdded(newComment);
      setComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Could not post comment');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment..."
        required
      />
      <button type="submit">Post Comment</button>
    </form>
  );
}
