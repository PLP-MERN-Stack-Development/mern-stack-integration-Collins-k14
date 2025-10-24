import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { postService } from '../services/api';
import { useApi } from '../hooks/useApi';
import CommentForm from '../components/CommForm';

export default function PostPage() {
  const { id } = useParams();
  const { data: post, loading, error } = useApi(postService.getPost, id);
  const [comments, setComments] = useState([]);

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading post</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      <h3>Comments</h3>
      {comments.length > 0 ? (
        comments.map((c) => <p key={c._id}>{c.content}</p>)
      ) : (
        <p>No comments yet</p>
      )}

      <CommentForm postId={id} onCommentAdded={handleCommentAdded} />
    </div>
  );
}
