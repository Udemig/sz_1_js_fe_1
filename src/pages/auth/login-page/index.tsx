import { FormEvent, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  AuthLoginDataType,
  AuthStateType,
  loginAction,
} from "../../../redux/slice/authSlice";
import { RootState, appDispatch } from "../../../redux/store";
import { formJson } from "../../../utils/functions";

export default function LoginPage() {
  const authState = useSelector<RootState, AuthStateType>(
    (state) => state.authState
  );
  const navigate = useNavigate();

  useEffect(() => {
    /* Tarayıcıyı yönlendirme işlemleri iki yerde yapmak mümkün.
    Bunlardan birincisi ilgili componentte kontrollü şekilde yönlendirmek.
    İkincisi de bütün yönlendirmelerin bulunduğu bir context componenti
    oluşturup oradan yönetmek. Fakat bu ikinci yöntemin bir dezavantajı
    var, o da bazen işlerin çıkmaza girmesi. Bu yüzden yönlendirmeleri
    aslında context içerisinde yapsak daha kontrollü olur. */

    if (authState.user) {
      navigate("/");
    }
  }, [authState.user]);

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = formJson(event.currentTarget);

    console.log(">> 🚀 file: index.tsx:11 🚀 value:", value);

    /*
    http://127.0.0.1:5000/auth/login
    {"username":"test1","password":"test"}
    {"status":"error","errorMessage":"Şifreniz en az 6 karakter olmalı."}
    {"status":"success","data":{"token":"b64b3121-0b20-4f1c-9bc4-d549765915a1"}}
    */

    appDispatch(loginAction(value as AuthLoginDataType));
  }

  return (
    <form onSubmit={onFormSubmit}>
      <h1 className="h3 mb-3 fw-normal text-center">Please sign in</h1>
      <p>{authState.requestStatus}</p>

      {authState.errorMessage ? (
        <Alert variant="danger" dismissible>
          <Alert.Heading>Bir hata oluştu!</Alert.Heading>
          <p>{authState.errorMessage}</p>
        </Alert>
      ) : null}

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
      <button
        className="btn btn-primary w-100 py-2"
        type="submit"
        disabled={authState.requestStatus === "pending"}
      >
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
