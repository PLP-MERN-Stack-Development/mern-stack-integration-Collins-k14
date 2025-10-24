import { useState, useEffect } from 'react';
import { postService, categoryService } from '../services/api';
import PostList from '../components/PostList';
import { useApi } from '../hooks/useApi';

export default function Home() {
  const { data: posts, loading, error } = useApi(postService.getAllPosts);
  const { data: categories } = useApi(categoryService.getAllCategories);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (category) => setSelectedCategory(category);

  return (
    <div>
      <h1>Blog Posts</h1>

      {/* Categories Filter */}
      {categories && (
        <div>
          <button onClick={() => setSelectedCategory(null)}>All</button>
          {categories.map((cat) => (
            <button key={cat._id} onClick={() => handleCategoryChange(cat.name)}>
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Loading & Error */}
      {loading && <p>Loading posts...</p>}
      {error && <p>Error loading posts.</p>}

      {/* Post List */}
      {posts && <PostList posts={posts} />}
    </div>
  );
}
