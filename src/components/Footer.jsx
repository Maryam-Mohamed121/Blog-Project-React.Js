import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary text-dark py-5 ">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="mb-4">
              <h4 className=" mb-3">MaryLogs</h4>
              <p className="">
                Share your thoughts and connect with the world through your
                personal blog.
              </p>
            </div>
            <div className="d-flex gap-3">
              <a href="#" className=" fs-5">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className=" fs-5">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className=" fs-5">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className=" fs-5">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-4">
            <h5 className=" mb-3">Explore</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="/" className="nav-link p-0 ">
                  Home
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/posts" className="nav-link p-0 ">
                  Posts
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link p-0 ">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link p-0 ">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4">
            <h5 className=" mb-3">Account</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link className="nav-link p-0 ">Login</Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link p-0 ">Register</Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link p-0 ">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-4">
            <h5 className=" mb-3">Newsletter</h5>
            <p className="">Subscribe to get updates on new features</p>
            <form className="mb-3">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your email"
                  aria-label="Your email"
                />
                <button className="btn btn-success" type="submit">
                  <i className="bi bi-envelope"></i>
                </button>
              </div>
            </form>
            <small className="">
              We respect your privacy. Unsubscribe at any time.
            </small>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 ">
              &copy; {new Date().getFullYear()} MaryLogs. All rights reserved to
              Maryam🤩
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link className=" text-decoration-none">Privacy</Link>
              </li>
              <li className="list-inline-item px-2">·</li>
              <li className="list-inline-item">
                <Link className=" text-decoration-none">Terms</Link>
              </li>
              <li className="list-inline-item px-2">·</li>
              <li className="list-inline-item">
                <Link className=" text-decoration-none">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
