import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { APIClient } from "@/api";

export default function UserPosts() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const userRes = await APIClient.get(`/users/${id}`);
      setUser(userRes.data);
      const postsRes = await APIClient.get(`/users/${id}/posts`);
      setPosts(postsRes.data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4">{user.name}'s Posts</h2>
      <div className="row g-4">
        {posts.map((post) => (
          <div className="col-12 col-md-6 col-lg-4" key={post.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.content.slice(0, 100)}...</p>
                <Link
                  to={`/posts/${post.id}`}
                  className="btn btn-primary btn-sm"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
