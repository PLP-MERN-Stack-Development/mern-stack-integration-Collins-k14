import { useState } from 'react';

export default function PostForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    category: initialData.category || '',
  });

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
      />
      <textarea
        name="content"
        placeholder="Content"
        value={form.content}
        onChange={handleChange}
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
