import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../services/api';

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await postService.getPost(id);
        setPost(data);
        setComments(data.comments || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);


  const handleAddComment = async () => {
    if (!newComment) return;

    const tempComment = {
      _id: Date.now(), 
      content: newComment,
      author: { name: 'You' },
    };
    setComments([...comments, tempComment]);
    setNewComment('');

    try {
      const savedComment = await postService.addComment(id, { content: tempComment.content });
      setComments((prev) =>
        prev.map((c) => (c._id === tempComment._id ? savedComment : c))
      );
    } catch (err) {
      console.error(err);
      setComments((prev) => prev.filter((c) => c._id !== tempComment._id));
      alert('Failed to add comment.');
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      <div>
        <h3>Comments</h3>
        {comments.map((c) => (
          <p key={c._id}>
            <strong>{c.author.name}:</strong> {c.content}
          </p>
        ))}

        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={handleAddComment}>Submit</button>
      </div>
    </div>
  );
}
