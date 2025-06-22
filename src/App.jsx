import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { NavBar, Layout } from "@components";
import { HomePage, Login, Register, Profile, PostList } from "@pages";
import AuthGurdRoute from "./components/AuthGurd";
import PostForm from "./Pages/PostForm";
import SinglePost from "./Pages/SinglePost";

// import UserPosts from "./Pages/UserPosts";
import "./style.css";

function App() {
  return (
    <Router>
      <NavBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/users/:id/posts" element={<UserPosts />} /> */}
          <Route path="/posts/:id" element={<SinglePost />} />
          <Route path="/posts/new" element={<PostForm />} />
          <Route path="/posts/:id/edit" element={<PostForm />} />
          <Route element={<AuthGurdRoute />}>
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route
              path="/posts"
              element={
                <Layout>
                  <PostList />
                </Layout>
              }
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
