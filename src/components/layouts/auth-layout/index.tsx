import { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./style.css";

export type AuthLayoutPropsType = {
  children: ReactNode;
};

export default function AuthLayout(props: AuthLayoutPropsType) {
  return (
    <div className="d-flex align-items-center py-4 bg-body-tertiary">
      <main className="form-signin w-100 block-centered">
        {props.children}
        <p className="mt-5 mb-3 text-body-secondary">
          &copy; 2017–2023
          <br />
          <Link to={"/"}>Mainpage</Link>
        </p>
      </main>
    </div>
  );
}
