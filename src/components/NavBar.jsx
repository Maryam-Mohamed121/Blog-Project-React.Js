import { useAuthStore } from "@/store/auth";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getMyPosts } from "@/api/posts";

export default function Navbar() {
  const { token, clear } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  // Fetch current user's posts once when logged in
  useEffect(() => {
    if (token) {
      getMyPosts()
        .then((res) => setAllPosts(res.data))
        .catch(() => setAllPosts([]));
    } else {
      setAllPosts([]);
    }
  }, [token]);

  // Filter posts by title as user types
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allPosts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
      setFilteredPosts(filtered);
      setShowDropdown(true);
    } else {
      setFilteredPosts([]);
      setShowDropdown(false);
    }
  }, [searchQuery, allPosts]);

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (postId) => {
    setSearchQuery("");
    setShowDropdown(false);
    navigate(`/posts/${postId}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-journal-text me-2"></i>
          MyBlog
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/posts">
                <i className="bi bi-collection me-1"></i>
                Posts
              </Link>
            </li>
            {token && (
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  <i className="bi bi-person me-1"></i>
                  Profile
                </Link>
              </li>
            )}
          </ul>

          <form
            className="d-flex me-3 my-2 my-lg-0 position-relative"
            role="search"
            autoComplete="off"
            ref={dropdownRef}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="input-group">
              <input
                className="form-control"
                type="search"
                placeholder="Search posts..."
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowDropdown(true)}
              />
              <button className="btn btn-success" type="button" tabIndex={-1}>
                <i className="bi bi-search"></i>
              </button>
            </div>
            {/* Dropdown results */}
            {showDropdown && filteredPosts.length > 0 && (
              <ul
                className="list-group position-absolute w-100 shadow"
                style={{ top: "100%", zIndex: 1000 }}
              >
                {filteredPosts.map((post) => (
                  <li
                    key={post.id}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleResultClick(post.id)}
                  >
                    {post.title}
                  </li>
                ))}
              </ul>
            )}
            {showDropdown && searchQuery && filteredPosts.length === 0 && (
              <ul
                className="list-group position-absolute w-100 shadow"
                style={{ top: "100%", zIndex: 1000 }}
              >
                <li className="list-group-item text-muted">No posts found</li>
              </ul>
            )}
          </form>

          <ul className="navbar-nav">
            {token ? (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light"
                  onClick={() => {
                    clear();
                    navigate("/login");
                  }}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light me-2" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-success" to="/register">
                    <i className="bi bi-person-plus me-1"></i>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
