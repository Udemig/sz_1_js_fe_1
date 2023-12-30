import { FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthLoginDataType, loginAction } from "../../../redux/slice/authSlice";
import { appDispatch } from "../../../redux/store";

export default function LoginPage() {
  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = Object.fromEntries(data.entries());
    console.log(">> 🚀 file: index.tsx:11 🚀 value:", value);

    appDispatch(loginAction(value as AuthLoginDataType));
  }

  return (
    <form onSubmit={onFormSubmit}>
      <h1 className="h3 mb-3 fw-normal text-center">Please sign in</h1>

      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          name="username"
          placeholder="Username"
        />
        <label htmlFor="floatingInput">Username</label>
      </div>
      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          name="password"
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
        <i className="fa-solid fa-right-to-bracket"></i>
        &nbsp; Login
      </button>

      <hr />
      <Link to={"/auth/register"} className="btn btn-outline-success me-2">
        <i className="fa-solid fa-right-to-bracket"></i>
        &nbsp; Register
      </Link>
      <Link to={"/auth/register"} className="btn btn-outline-success me-2">
        <i className="fa-solid fa-right-to-bracket"></i>
        &nbsp; Forgot Password
      </Link>
    </form>
  );
}
