import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { createPost, updatePost, getPost } from "@/api/posts";
import { postSchema } from "@/forms/schema/postsSchema";
import { useAuthStore } from "@/store/auth";

export default function PostForm() {
  const { user } = useAuthStore();
  const userId = user?.id;
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      sections: [{ title: "", body: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  useEffect(() => {
    if (id) {
      const fetchPostData = async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
          const response = await getPost(id);

          // Verify post belongs to current user
          if (response.data.userId !== userId) {
            throw new Error("You don't have permission to edit this post");
          }

          reset(response.data);
        } catch (error) {
          console.error("Error fetching post:", error);
          setFetchError(error.message || "Failed to load post");
          navigate("/posts");
        } finally {
          setIsLoading(false);
        }
      };
      fetchPostData();
    }
  }, [id, reset, navigate, userId]);

  const onSubmit = async (data) => {
    setSubmitError(null);

    if (!userId) {
      setSubmitError("User not found. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const postData = { ...data, userId };

      if (id) {
        await updatePost(id, postData);
      } else {
        await createPost(postData);
      }

      navigate("/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        setSubmitError(error.message || "Error saving post");
      }
    }
  };

  if (isLoading) {
    return <div className="text-center my-5">Loading post data...</div>;
  }

  if (fetchError) {
    return (
      <div className="alert alert-danger my-5">
        {fetchError}
        <button onClick={() => navigate("/posts")} className="btn btn-link">
          Back to posts
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="mb-4">{id ? "Edit Post" : "Create New Post"}</h2>

              {submitError && (
                <div className="alert alert-danger mb-4">{submitError}</div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Title field */}
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
                    }`}
                    {...register("title")}
                    disabled={isSubmitting}
                  />
                  {errors.title && (
                    <div className="invalid-feedback">
                      {errors.title.message}
                    </div>
                  )}
                </div>

                {/* Content field */}
                <div className="mb-3">
                  <label className="form-label">Content</label>
                  <textarea
                    className={`form-control ${
                      errors.content ? "is-invalid" : ""
                    }`}
                    rows={4}
                    {...register("content")}
                    disabled={isSubmitting}
                  />
                  {errors.content && (
                    <div className="invalid-feedback">
                      {errors.content.message}
                    </div>
                  )}
                </div>

                {/* Sections */}
                <div className="mb-4">
                  <h4 className="mb-3">Sections</h4>
                  {fields.map((section, idx) => (
                    <div key={section.id} className="card mb-3">
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label">Section Title</label>
                          <input
                            className={`form-control ${
                              errors.sections?.[idx]?.title ? "is-invalid" : ""
                            }`}
                            {...register(`sections.${idx}.title`)}
                            disabled={isSubmitting}
                          />
                          {errors.sections?.[idx]?.title && (
                            <div className="invalid-feedback">
                              {errors.sections[idx].title.message}
                            </div>
                          )}
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Section Body</label>
                          <textarea
                            className={`form-control ${
                              errors.sections?.[idx]?.body ? "is-invalid" : ""
                            }`}
                            rows={2}
                            {...register(`sections.${idx}.body`)}
                            disabled={isSubmitting}
                          />
                          {errors.sections?.[idx]?.body && (
                            <div className="invalid-feedback">
                              {errors.sections[idx].body.message}
                            </div>
                          )}
                        </div>
                        <div className="d-flex justify-content-end">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => remove(idx)}
                            disabled={fields.length === 1 || isSubmitting}
                          >
                            Remove Section
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => append({ title: "", body: "" })}
                    disabled={isSubmitting}
                  >
                    Add Section
                  </button>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/posts")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {id ? "Updating..." : "Creating..."}
                      </>
                    ) : id ? (
                      "Update Post"
                    ) : (
                      "Create Post"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
