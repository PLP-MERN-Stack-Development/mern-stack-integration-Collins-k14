import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { postService } from '../services/api';
import PostForm from '../components/PostForm';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getPost(id);
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        alert('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await postService.updatePost(id, formData);
      navigate(`/post/${id}`);
    } catch (err) {
      console.error('Error updating post:', err);
      alert('Failed to update post');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div>
      <h1>Edit Post</h1>
      <PostForm initialData={post} onSubmit={handleUpdate} />
    </div>
  );
}
