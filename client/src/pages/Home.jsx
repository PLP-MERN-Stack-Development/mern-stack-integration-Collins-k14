import { useState, useEffect } from 'react';
import { postService, categoryService } from '../services/api';
import PostList from '../components/PostList';
import { useApi } from '../hooks/useApi';

export default function Home() {
  const { data: posts, loading, error } = useApi(postService.getAllPosts);
  const { data: categories } = useApi(categoryService.getAllCategories);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // normalize categories to an array 
  const categoryList = Array.isArray(categories)
    ? categories
    : (categories && categories.data) || [];

  // normalize posts to an array
  const postList = Array.isArray(posts)
    ? posts
    : (posts && posts.data) || [];

  const handleCategoryChange = (category) => setSelectedCategory(category);

  return (
    <div>
      <h1>Blog Posts</h1>

      {/* Categories Filter */}
      {categoryList.length > 0 && (
        <div>
          <button onClick={() => setSelectedCategory(null)}>All</button>
          {categoryList.map((cat) => (
            <button key={cat._id} onClick={() => handleCategoryChange(cat.name)}>
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Loading & Error */}
      {loading && <p>Loading posts...</p>}
      {error && <p>Error loading posts.</p>}

      {/* Post List - pass normalized posts and categories */}
      <PostList posts={postList} categories={categoryList} />
    </div>
  );
}
