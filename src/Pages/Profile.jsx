import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { getMe, updateUser } from "@/api/user";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "@/components/EditProfileModal";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { token, clear } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await getMe();
        setUserData(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load profile data. Please try again.");
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

  const handleLogout = () => {
    clear();
    navigate("/login");
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      // Call your API to update user info here
      const updated = await updateUser(userData.id, updatedData);
      setUserData(updated.data); // update UI with backend response
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="alert alert-warning text-center">
              {error || "No user data found. Please log in."}
              <div className="mt-3">
                <Button variant="primary" onClick={() => navigate("/login")}>
                  Go to Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {console.log("userData:", userData)}
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <div className="text-center mb-4">
                <h2>User Profile</h2>
              </div>

              <div className="text-center mb-4">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="User avatar"
                    className="rounded-circle mb-3 shadow"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      border: "4px solid #fff",
                      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-primary mb-3 d-flex align-items-center justify-content-center mx-auto shadow"
                    style={{
                      width: "150px",
                      height: "150px",
                      color: "#fff",
                      fontSize: "3rem",
                    }}
                  >
                    <span>
                      {userData.name ? userData.name[0].toUpperCase() : "U"}
                    </span>
                  </div>
                )}
                <h3 className="mb-1">{userData.name || "No name provided"}</h3>
                <p className="text-muted">@{userData.username || "username"}</p>
              </div>

              <div className="card mb-3">
                <div className="card-header bg-light">
                  <h5 className="mb-0 text-center">Personal Information</h5>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Email</span>
                    <span>{userData.email}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Phone</span>
                    <span>
                      {userData.phone || (
                        <span className="text-muted">Not provided</span>
                      )}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="d-grid gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit Profile
                </Button>
              </div>
              <div className="d-grid gap-2 mt-2">
                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditProfileModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={userData}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
