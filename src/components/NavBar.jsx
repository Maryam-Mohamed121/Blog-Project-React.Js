import { useAuthStore } from "@/store/auth";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getMyPosts } from "@/api/posts";

export default function Navbar() {
  const { token, user, clear } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const dropdownRef = useRef();
  const debounceTimeout = useRef();

  // Fetch current user's posts when token or user changes
  useEffect(() => {
    if (token) {
      setLoadingPosts(true);
      getMyPosts()
        .then((res) => setAllPosts(res.data))
        .catch(() => setAllPosts([]))
        .finally(() => setLoadingPosts(false));
    } else {
      setAllPosts([]);
    }
  }, [token, user]);

  // Debounced search
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (searchQuery.trim()) {
      debounceTimeout.current = setTimeout(() => {
        const filtered = allPosts.filter((post) =>
          post.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
        setFilteredPosts(filtered);
        setShowDropdown(true);
      }, 200);
    } else {
      setFilteredPosts([]);
      setShowDropdown(false);
    }
    return () => clearTimeout(debounceTimeout.current);
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
            {showDropdown && (
              <ul
                className="list-group position-absolute w-100 shadow"
                style={{ top: "100%", zIndex: 1000 }}
              >
                {loadingPosts ? (
                  <li className="list-group-item text-center">
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  </li>
                ) : filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <li
                      key={post.id}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleResultClick(post.id)}
                    >
                      {post.title}
                    </li>
                  ))
                ) : searchQuery ? (
                  <li className="list-group-item text-muted">No posts found</li>
                ) : null}
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
                  <Link className="btn btn-outline-light " to="/register">
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
