import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { postService, categoryService } from '../api/api';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch categories for filter
  useEffect(() => {
    categoryService.getAllCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  // Fetch posts whenever page, category, or search changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await postService.getAllPosts(page, 10, category, search);
        setPosts(data.data);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, category, search]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Search + Category Filter */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Post List */}
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="post-list grid gap-4">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex gap-2 justify-center mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>{page} / {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
