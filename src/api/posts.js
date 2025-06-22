// import { APIClient } from "./index";

// // Get all posts (optionally for current user)
// export const getPosts = () => APIClient.get("/posts");

// // Get posts for a specific user
// export const getUserPosts = (userId) => APIClient.get(`/users/${userId}/posts`);

// // Get a single post by ID
// export const getPost = (id) => APIClient.get(`/posts/${id}`);

// // Create a new post
// export const createPost = (data) => APIClient.post("/posts", data);

// // Update a post
// export const updatePost = (id, data) => APIClient.put(`/posts/${id}`, data);

// // Delete a post
// export const deletePost = (id) => APIClient.delete(`/posts/${id}`);

// // Get posts for the currently authenticated user (if your backend supports it)
// export const getMyPosts = () => APIClient.get("/posts");
import { APIClient } from "./index";
import { useAuthStore } from "@/store/auth";

// Get all posts for the current user
export const getMyPosts = async () => {
  const { user } = useAuthStore.getState();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  // Option 1: If your backend supports filtering by user
  // return APIClient.get(`/users/${user.id}/posts`);

  // Option 2: Filter on the client side (less secure but works with your current backend)
  const response = await APIClient.get("/posts");
  return {
    ...response,
    data: response.data.filter((post) => post.userId === user.id),
  };
};

// Get a single post by ID (with user verification)
export const getPost = async (id) => {
  const response = await APIClient.get(`/posts/${id}`);
  const { user } = useAuthStore.getState();

  // Verify the post belongs to the current user
  if (response.data.userId !== user?.id) {
    throw new Error("Unauthorized access to post");
  }

  return response;
};

// Other functions remain the same
export const createPost = (data) => APIClient.post("/posts", data);
// Update your updatePost function in posts.js
export const updatePost = async (id, data) => {
  try {
    // Only send title and content to match backend API
    const response = await APIClient.put(`/posts/${id}`, {
      title: data.title,
      content: data.content,
    });
    return response;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};
// Update your deletePost function in posts.js
export const deletePost = async (id) => {
  try {
    // First attempt normal deletion
    return await APIClient.delete(`/posts/${id}`);
  } catch (error) {
    console.error("First delete attempt failed:", error);

    // If first attempt fails, try again (sometimes servers fail on first try)
    try {
      return await APIClient.delete(`/posts/${id}`);
    } catch (retryError) {
      console.error("Second delete attempt failed:", retryError);
      throw new Error(
        retryError.response?.data?.message ||
          "Failed to delete post. It may have associated sections that prevent deletion."
      );
    }
  }
};
