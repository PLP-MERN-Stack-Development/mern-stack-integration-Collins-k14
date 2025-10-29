import { useState, useEffect } from 'react';
import { categoryService } from '../services/api';

export default function PostForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    excerpt: '',
    isPublished: false,
    ...initialData,
  });
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null); // For file upload
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
      
        // normalize to an array whether API returns array 
        const list = Array.isArray(data) ? data : (data && data.data) || [];
        setCategories(list);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = 'Title is required';
    if (!form.content) newErrors.content = 'Content is required';
    if (!form.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('title', form.title || '');
    formData.append('content', form.content || '');
    formData.append('excerpt', form.excerpt || '');
    formData.append('category', form.category || '');
    formData.append('isPublished', form.isPublished ? 'true' : 'false');

    // send tags as repeated fields so server gets an array
    const tagsArray = form.tags
      ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
    tagsArray.forEach((tag) => formData.append('tags[]', tag));

    if (image) formData.append('image', image); // matches upload.single('image')

    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Post Title"
        className="border p-2 rounded"
      />
      {errors.title && <p className="text-red-500">{errors.title}</p>}

      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Post Content"
        className="border p-2 rounded"
      />
      {errors.content && <p className="text-red-500">{errors.content}</p>}

      <input
        type="text"
        name="tags"
        value={form.tags}
        onChange={handleChange}
        placeholder="Tags (comma separated)"
        className="border p-2 rounded"
      />

      <input
        type="text"
        name="excerpt"
        value={form.excerpt}
        onChange={handleChange}
        placeholder="Excerpt"
        className="border p-2 rounded"
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id || cat.slug} value={cat.slug || cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      {errors.category && <p className="text-red-500">{errors.category}</p>}

      <label className="flex flex-col">
        Featured Image
        <input type="file" onChange={handleFileChange} />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isPublished"
          checked={form.isPublished}
          onChange={handleChange}
        />
        Publish
      </label>

      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}
