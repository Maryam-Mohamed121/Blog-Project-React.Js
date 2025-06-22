import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPost, deletePost } from "@/api/posts";
import EditPostModal from "@/components/EditPostModal";
import { useAuthStore } from "@/store/auth";

export default function SinglePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPost(id);
        // Verify post belongs to current user
        if (response.data.userId !== user?.id) {
          throw new Error("You don't have permission to view this post");
        }
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error.message || "Post not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user?.id]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? " +
          "Posts with sections might not delete properly."
      )
    )
      return;

    setDeleteError(null);
    try {
      await deletePost(id);
      navigate("/posts", {
        state: { message: "Post deleted successfully" },
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      setDeleteError(
        error.message + " Please contact support if this persists."
      );
    }
  };

  const handleEdit = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);
  const handlePostSaved = (updatedPost) => setPost(updatedPost);

  if (loading) return <div className="text-center my-5">Loading post...</div>;
  if (error) return <div className="alert alert-danger my-5">{error}</div>;
  if (!post)
    return <div className="alert alert-warning my-5">Post not found.</div>;

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="mb-3">{post.title}</h1>
              <p className="text-muted mb-2">
                By <strong>{post.user?.name || "Unknown author"}</strong>
              </p>

              <div className="mb-4">{post.content}</div>
              {post.sections?.length > 0 && (
                <div className="mb-4">
                  <h4>Sections</h4>
                  {post.sections.map((section, idx) => (
                    <div key={idx} className="mb-3 p-3 border rounded bg-light">
                      <h5>{section.title}</h5>
                      <p>{section.body}</p>
                    </div>
                  ))}
                </div>
              )}
              {deleteError && (
                <div className="alert alert-danger mb-3">{deleteError}</div>
              )}
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={handleEdit}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
                <Link to="/posts" className="btn btn-secondary">
                  Back to Posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditPostModal
        show={showModal}
        onClose={handleModalClose}
        post={post}
        onSaved={handlePostSaved}
      />
    </div>
  );
}
