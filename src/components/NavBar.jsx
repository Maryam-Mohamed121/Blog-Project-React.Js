import { useAuthStore } from "@/store/auth";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const { token, clear } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
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
            className="d-flex me-3 my-2 my-lg-0"
            onSubmit={handleSearch}
            role="search"
          >
            <div className="input-group">
              <input
                className="form-control"
                type="search"
                placeholder="Search posts..."
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-light" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
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
                  <Link className="btn btn-light" to="/register">
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
