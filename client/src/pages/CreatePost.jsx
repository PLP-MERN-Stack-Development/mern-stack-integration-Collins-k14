import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/api';
import PostForm from '../components/PostForm';

export default function CreatePost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreatePost = async (formData) => {
    setLoading(true);
    setError(null);
    try {
    
      const newPost = await postService.createPost(formData);
      navigate(`/post/${newPost._id}`); 
    } catch (err) {
      console.error(err);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create New Post</h1>
      {error && <p className="error">{error}</p>}
      <PostForm onSubmit={handleCreatePost} />
      {loading && <p>Creating post...</p>}
    </div>
  );
}
