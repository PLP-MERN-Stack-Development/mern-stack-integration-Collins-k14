import React from 'react';

export default function PostCard({ post }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {post.featuredImage && (
        <img
          src={`http://localhost:5000/uploads/${post.featuredImage}`}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">
          {post.category?.name} • {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
        <p className="text-gray-600 mt-2 line-clamp-3">{post.excerpt || post.content}</p>
        <div className="mt-4 flex items-center">
          <div className="text-sm text-gray-500">By {post.author?.name}</div>
        </div>
      </div>
    </div>
  );
}
