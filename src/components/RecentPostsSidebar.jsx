import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecentPosts } from "@/api/posts";

export default function RecentPostsSidebar() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await getRecentPosts(5);
        setRecentPosts(res.data);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <div className="pt-4" fixed-top>
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Recent Activity</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="d-flex justify-content-center py-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="text-center py-3">
              <p className="text-muted">No recent activity</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.id}`}
                  className="list-group-item list-group-item-action border-0 px-0 py-3"
                >
                  <div className="d-flex align-items-center">
                    {post.image && (
                      <div className="flex-shrink-0 me-3">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="rounded"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{post.title}</h6>
                      <small className="text-muted">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Quick Actions</h5>
        </div>
        <div className="card-body">
          <Link to="/posts/new" className="btn btn-primary w-100 mb-2">
            Create New Post
          </Link>
          <Link to="/profile" className="btn btn-outline-primary w-100">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
