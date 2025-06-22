import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { getMe } from "@/api/user";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getMe();
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) return <div>Loading profile...</div>;
  if (!userData) return <div>No user data found. Please log in.</div>;

  return (
    <div className="profile-container">
      <h1>User Profile</h1>

      <div className="profile-section">
        {userData.avatar && (
          <div className="avatar">
            <img src={userData.avatar} alt="User avatar" />
          </div>
        )}

        <div className="profile-info">
          <h2>{userData.name || "No name provided"}</h2>
          <p>
            <strong>Username:</strong> {userData.username || "Not set"}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Phone:</strong> {userData.phone || "Not provided"}
          </p>
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        .profile-section {
          display: flex;
          gap: 2rem;
          margin-top: 2rem;
        }
        .profile-info {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
