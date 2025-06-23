import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyPosts } from "@/api/posts";

export default function RecentPostsSidebar() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getMyPosts();
        setPosts(res.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="pt-4" fixed-top>
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary ">
          <h5 className="mb-0">Latest Posts</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="d-flex justify-content-center py-3">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-3">
              <p className="text-primary">No posts found</p>
            </div>
          ) : (
            <div className=" text-center  ">
              {posts.map((post) => (
                <Link
                  style={{
                    color: "var(--primary) !important",
                    ":hover": { color: "var(--secondary) !important" },
                  }}
                  key={post.id}
                  to={`/posts/${post.id}`}
                  className="list-group-item list-group-item-action border-0 px-0 py-3"
                >
                  <div className="d-flex align-items-center">
                    {/* {post.image && (
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
                    )} */}
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{post.title}</h6>
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
            <i className="bi bi-plus-circle me-1"></i> Create New Post
          </Link>
          <Link to="/profile" className="btn btn-outline-primary w-100">
            <i className="bi bi-person me-1"></i> View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
