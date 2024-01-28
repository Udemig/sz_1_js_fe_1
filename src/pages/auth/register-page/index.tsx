import { FormEvent, useState } from "react";
import { Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { SwalToast } from "../../../components/swal-toast";
import { chatHttpApi } from "../../../utils/api";
import { formJson } from "../../../utils/functions";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const value = formJson(event.currentTarget);

      console.log(">> 🚀 file: index.tsx 🚀 value:", value);

      const api = chatHttpApi();
      const result = await api.post("/auth/register", value);
      console.log(">> 🚀 result:", result);

      // TODO Gelen JSON objesinin türünü (typeını) oluştur.
      if (result.data.status === "error") {
        setErrorMessage(result.data.errorMessage);
      } else {
        SwalToast.fire({
          icon: "success",
          title: "Kaydınız başarıyla gerçekleşti, şimdi giriş yapabilirsiniz.",
        });

        navigate("/auth/login");
      }
    } catch (e) {
      if (e instanceof Error) {
        setErrorMessage(e.message);
      } else {
        console.log("Error", e);
        setErrorMessage("Unknown error occured.");
      }
    }
  }

  return (
    <form onSubmit={onFormSubmit}>
      <h1 className="h3 mb-3 fw-normal text-center">Please register</h1>

      {errorMessage.length > 0 ? (
        <Alert variant="danger" dismissible>
          <Alert.Heading>Bir hata oluştu!</Alert.Heading>
          <p>{errorMessage}</p>
        </Alert>
      ) : null}

      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          name="username"
          placeholder="Username"
        />
        <label>Username</label>
      </div>
      <div className="form-floating">
        <input
          type="email"
          className="form-control"
          name="email"
          placeholder="name@example.com"
        />
        <label>Email address</label>
      </div>
      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          name="password"
          placeholder="Password"
        />
        <label>Password</label>
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
