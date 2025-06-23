import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyPosts } from "@/api/posts";
import Footer from "@/components/Footer";
import RecentPostsSidebar from "@/components/RecentPostsSidebar";
import { useAuthStore } from "@/store/auth";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!user?.id) {
          navigate("/login");
          return;
        }

        const res = await getMyPosts();
        setPosts(res.data);
      } catch (e) {
        console.error(e);
        if (
          e.response?.status === 401 ||
          e.message === "User not authenticated"
        ) {
          navigate("/login");
        } else {
          setError("Error fetching posts");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user, navigate]);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-center my-5 py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger my-5">{error}</div>;

  return (
    <div className="container-fluid ">
      <div className="row">
        {/* Main Content */}
        <div className="text-center mb-3 mt-2">
          <h1 className="display-4 fw-bold">Welcome to MaryLogs</h1>
          <p className="lead text-muted">Manage and view your personal posts</p>
        </div>
        <main className="col-lg-8">
          <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">Your Posts</h2>
              <Link to="/posts/new" className="btn btn-success">
                Create New Post
              </Link>
            </div>

            <div className="row g-4">
              {currentPosts.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <h4>You haven't created any posts yet</h4>
                  <Link to="/posts/new" className="btn btn-primary mt-3">
                    Create Your First Post
                  </Link>
                </div>
              ) : (
                currentPosts.map((post) => (
                  <div className="col-12" key={post.id}>
                    <div className="card shadow-sm mb-4">
                      <div className="row g-0">
                        {post.image && (
                          <div className="col-md-4">
                            <img
                              src={post.image}
                              className="img-fluid rounded-start h-100"
                              alt={post.title}
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        )}
                        <div className={post.image ? "col-md-8" : "col-12"}>
                          <div className="card-body">
                            <h3 className="card-title">{post.title}</h3>
                            <small className="text-muted d-block mb-2">
                              {`By ${user?.name || "Anonymous"}`}
                            </small>
                            <p className="card-text">
                              {post.content.length > 200
                                ? post.content.substring(0, 200) + "..."
                                : post.content}
                            </p>
                            <div className="d-flex gap-2">
                              <Link
                                to={`/posts/${post.id}`}
                                className="btn btn-primary"
                              >
                                Read More
                              </Link>
                              <Link
                                to={`/posts/${post.id}/edit`}
                                className="btn btn-outline-secondary"
                              >
                                Edit
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-5">
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="col-lg-4 py-5 ">
          <RecentPostsSidebar />
        </aside>
      </div>

      {/* <Footer /> */}
    </div>
  );
}
