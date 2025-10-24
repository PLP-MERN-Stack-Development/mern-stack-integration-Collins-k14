import { postService } from '../services/api';
import { useApi } from '../hooks/useApi';
import PostList from '../components/PostList';

export default function Home() {
  const { data: posts, loading, error } = useApi(postService.getAllPosts, 1, 10);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts</p>;

  return <PostList posts={posts} />;
}
