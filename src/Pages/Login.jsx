import { logInAPI } from "@/api/auth";
import { getMe } from "@/api/user";
import { loginSchema } from "@/forms/schema";
import { useAuthStore } from "@/store/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import qs from "qs";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { search } = useLocation();
  const { redirectTo } = qs.parse(search, { ignoreQueryPrefix: true });
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      // 1. Login and get tokens
      const res = await logInAPI(data);
      const { token, refreshToken } = res.data;

      // 2. Store tokens temporarily so getMe can use them
      setTokens({ token, refreshToken, user: null });

      // 3. Fetch user profile using the token
      const userRes = await getMe();
      const user = userRes.data;

      // 4. Store user in Zustand
      setTokens({ token, refreshToken, user });

      navigate(redirectTo ?? "/");
    } catch (e) {
      console.error(e);
      alert("Login failed");
    } finally {
      reset();
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="mb-4 text-center">Login</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>

                  <input
                    id="email"
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email")}
                  />
                  {errors?.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password:
                  </label>
                  <input
                    id="password"
                    type="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    {...register("password")}
                  />
                  {errors?.password && (
                    <div className="invalid-feedback">
                      {errors.password.message}
                    </div>
                  )}
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-success">
                    Log In
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
