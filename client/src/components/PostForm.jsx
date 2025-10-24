import { useState, useEffect } from 'react';
import { categoryService } from '../services/api';

export default function PostForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    ...initialData,
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    onSubmit(form); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Post Title"
      />
      {errors.title && <p>{errors.title}</p>}

      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Post Content"
      />
      {errors.content && <p>{errors.content}</p>}

      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.name}>{cat.name}</option>
        ))}
      </select>
      {errors.category && <p>{errors.category}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
