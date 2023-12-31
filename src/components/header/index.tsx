import {
  Button,
  Container,
  Form,
  Nav,
  NavDropdown,
  Navbar,
  Offcanvas,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AuthStateType } from "../../redux/slice/authSlice";
import { RootState } from "../../redux/store";

export default function Header() {
  const authState = useSelector<RootState, AuthStateType>(
    (state) => state.authState
  );

  const expand = "md";
  return (
    <header>
      <Navbar expand={expand} className="bg-body-tertiary mb-3">
        <Container fluid>
          <Link to="/" className="navbar-brand">
            Chat
          </Link>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                Offcanvas
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Link to="/" className="nav-link">
                  Home
                </Link>
                <Link to="/chat" className="nav-link">
                  Chat
                </Link>

                {authState.user ? (
                  <Form className="d-flex">
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <Link
                      to="/user/profile"
                      className="btn btn-outline-primary me-2"
                    >
                      {authState.user.username}
                    </Link>
                    <Button variant="outline-danger">Logout</Button>
                  </Form>
                ) : (
                  <NavDropdown
                    title="Auth"
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                  >
                    <Link to="auth/login" className="dropdown-item">
                      Login
                    </Link>
                    <Link to="auth/register" className="dropdown-item">
                      Register
                    </Link>
                  </NavDropdown>
                )}
              </Nav>
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </header>
  );
}
