import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/create">Create Post</Link>
          <button onClick={logout}>Logout</button>
          <span>Welcome, {user.name}</span>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
