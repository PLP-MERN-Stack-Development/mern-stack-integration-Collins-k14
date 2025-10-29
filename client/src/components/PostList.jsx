import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { postService } from '../services/api';

export default function PostList({ posts = [], categories = [] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // normalize incoming props
  const initialPosts = Array.isArray(posts) ? posts : (posts && posts.data) || [];
  const categoryList = Array.isArray(categories) ? categories : (categories && categories.data) || [];

  const [postList, setPostList] = useState(initialPosts);

  // Fetch posts whenever page, category, or search changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await postService.getAllPosts(page, 10, category, search);
        setPostList(data?.data || []);
        setTotalPages(data?.pagination?.totalPages || 1);
      } catch (err) {
        console.error('fetchPosts error', err);
        setPostList([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, category, search]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-center">Blog Posts</h1>

      {/* Search + Category Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full md:flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full md:w-1/3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categoryList.map((cat) => (
            <option key={cat._id || cat.slug || cat.name} value={cat.slug || cat._id}>
              {cat.name || cat.slug}
            </option>
          ))}
        </select>
      </div>

      {/* Post List Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : postList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postList.map((post) => (
            <PostCard key={post._id || post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No posts found.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-8">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
        >
          Prev
        </button>
        <span className="flex items-center text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
