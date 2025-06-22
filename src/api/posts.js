import { APIClient } from "./index";
import { useAuthStore } from "@/store/auth";

export const getMyPosts = async () => {
  const { user } = useAuthStore.getState();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }
  const response = await APIClient.get("/posts");
  return {
    ...response,
    data: response.data.filter((post) => post.userId === user.id),
  };
};

export const getAllPosts = async () => {
  return await APIClient.get("/posts");
};

export const getRecentPosts = async (limit = 5) => {
  return await APIClient.get(`/posts/recent?limit=${limit}`);
};

export const getPost = async (id) => {
  const response = await APIClient.get(`/posts/${id}`);
  const { user } = useAuthStore.getState();

  if (response.data.userId !== user?.id) {
    throw new Error("Unauthorized access to post");
  }

  return response;
};

export const createPost = (data) => APIClient.post("/posts", data);
export const updatePost = async (id, data) => {
  try {
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
export const deletePost = async (id) => {
  try {
    return await APIClient.delete(`/posts/${id}`);
  } catch (error) {
    console.error("First delete attempt failed:", error);
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
