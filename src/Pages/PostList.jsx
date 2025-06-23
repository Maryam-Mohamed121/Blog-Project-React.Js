import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyPosts } from "@/api/posts";
import { useAuthStore } from "@/store/auth";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  if (loading) return <div className="text-center my-5">Loading posts...</div>;
  if (error) return <div className="alert alert-danger my-5">{error}</div>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">My Posts</h1>
        <Link to="/posts/new" className="btn btn-success">
          <i className="bi bi-plus-circle me-1"></i> Create New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-4">
          <p>You haven't created any posts yet.</p>
          <Link to="/posts/new" className="btn btn-primary mt-2">
            <i className="bi bi-plus-circle me-1"></i> Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {posts.map((post) => (
            <div className="col-12 col-md-6 col-lg-4" key={post.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text flex-grow-1">
                    {post.content.length > 100
                      ? post.content.substring(0, 100) + "..."
                      : post.content}
                  </p>
                  <div className="mt-3 d-flex justify-content-between">
                    <Link
                      to={`/posts/${post.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      <i className="bi bi-eye me-1"></i> View
                    </Link>
                    <Link
                      to={`/posts/${post.id}/edit`}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      <i className="bi bi-pencil-square me-1"></i> Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
