import { useState, useEffect } from "react";
import { updatePost, getPost } from "@/api/posts";
import { useAuthStore } from "@/store/auth";

export default function EditPostModal({ show, onClose, post, onSaved }) {
  const { user } = useAuthStore();
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    sections: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (post) {
      setEditData({
        title: post.title,
        content: post.content,
        sections: post.sections ? [...post.sections] : [],
      });
    }
  }, [post]);

  const handleEditChange = (e, idx, field) => {
    if (typeof idx === "number") {
      const newSections = [...editData.sections];
      newSections[idx][field] = e.target.value;
      setEditData({ ...editData, sections: newSections });
    } else {
      setEditData({ ...editData, [e.target.name]: e.target.value });
    }
  };

  const addSection = () => {
    setEditData({
      ...editData,
      sections: [...editData.sections, { title: "", body: "" }],
    });
  };

  const removeSection = (idx) => {
    const newSections = [...editData.sections];
    newSections.splice(idx, 1);
    setEditData({ ...editData, sections: newSections });
  };

  const handleSave = async () => {
    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updateData = {
        title: editData.title.trim(),
        content: editData.content.trim(),
        userId: user.id,
        // Note: Sections are intentionally not sent
      };

      await updatePost(post.id, updateData);
      const response = await getPost(post.id);

      // Merge sections from original post since backend doesn't update them
      onSaved({
        ...response.data,
        sections: post.sections, // Preserve original sections
      });

      onClose();
    } catch (error) {
      console.error("Error updating post:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update post (note: sections are not updated)"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!show || !post) return null;

  return (
    <div
      className="modal show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Post</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={saving}
            ></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger mb-3">{error}</div>}

            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                name="title"
                value={editData.title}
                onChange={handleEditChange}
                disabled={saving}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Content</label>
              <textarea
                className="form-control"
                name="content"
                value={editData.content}
                onChange={handleEditChange}
                rows={5}
                disabled={saving}
              />
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label mb-0">Sections</label>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={addSection}
                  disabled={saving}
                >
                  Add Section
                </button>
              </div>

              {editData.sections.map((section, idx) => (
                <div key={idx} className="mb-3 border rounded p-3">
                  <div className="mb-2">
                    <label className="form-label">Section Title</label>
                    <input
                      className="form-control mb-2"
                      value={section.title}
                      onChange={(e) => handleEditChange(e, idx, "title")}
                      disabled={saving}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Section Body</label>
                    <textarea
                      className="form-control"
                      value={section.body}
                      onChange={(e) => handleEditChange(e, idx, "body")}
                      rows={3}
                      disabled={saving}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeSection(idx)}
                    disabled={saving}
                  >
                    Remove Section
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  ></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
