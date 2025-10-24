import { useNavigate } from 'react-router-dom';
import { postService } from '../services/api';
import PostForm from '../components/PostForm';

export default function CreatePost() {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      await postService.createPost(formData);
      navigate('/'); 
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post');
    }
  };

  return (
    <div>
      <h1>Create Post</h1>
      <PostForm onSubmit={handleCreate} />
    </div>
  );
}
