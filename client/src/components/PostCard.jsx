import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="post-card">
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
      <Link to={`/post/${post._id}`}>Read More</Link>
    </div>
  );
}
