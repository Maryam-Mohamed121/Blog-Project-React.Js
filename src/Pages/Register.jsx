import { registerSchema } from "@/forms/schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerAPI } from "@/api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const dataWithDate = { ...data, createdAt: new Date().toISOString() };
      await registerAPI(dataWithDate);
      navigate("/login");
    } catch (e) {
      console.error(e);
    } finally {
      reset();
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="mb-4 text-center">Register</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="name">
                    Name:
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form-control"
                    {...register("name")}
                  />
                  <div className="form-text text-danger">
                    {errors?.name?.message}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="username">
                    Username:
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="form-control"
                    {...register("username")}
                  />
                  <div className="form-text text-danger">
                    {errors?.username?.message}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="phone">
                    Phone:
                  </label>
                  <input
                    id="phone"
                    type="text"
                    className="form-control"
                    {...register("phone")}
                  />
                  <div className="form-text text-danger">
                    {errors?.phone?.message}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email:
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    {...register("email")}
                  />
                  <div className="form-text text-danger">
                    {errors?.email?.message}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password:
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    {...register("password")}
                  />
                  <div className="form-text text-danger">
                    {errors?.password?.message}
                  </div>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-success">
                    Create Account
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
