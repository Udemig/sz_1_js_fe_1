import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <form>
      <h1 className="h3 mb-3 fw-normal text-center">Please register</h1>

      <div className="form-floating">
        <input
          type="email"
          className="form-control"
          id="floatingInput"
          placeholder="name@example.com"
        />
        <label htmlFor="floatingInput">Email address</label>
      </div>
      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <div className="form-check text-start my-3">
        <input
          className="form-check-input"
          type="checkbox"
          value="remember-me"
          id="flexCheckDefault"
        />
        <label className="form-check-label" htmlFor="flexCheckDefault">
          Remember me
        </label>
      </div>
      <button className="btn btn-primary w-100 py-2" type="submit">
        <i className="fa-solid fa-paper-plane"></i>
        &nbsp; Register
      </button>

      <hr />
      <Link to={"/auth/login"} className="btn btn-outline-success me-2">
        <i className="fa-solid fa-right-to-bracket"></i>
        &nbsp; Login
      </Link>
      <Link to={"/auth/register"} className="btn btn-outline-success me-2">
        <i className="fa-solid fa-right-to-bracket"></i>
        &nbsp; Forgot Password
      </Link>
    </form>
  );
}
