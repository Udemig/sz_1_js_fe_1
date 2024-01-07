import React from "react";
import {
  Badge,
  Button,
  Card,
  Form,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import { formJson, showSwal } from "../../../utils/functions";
import TextMessage from "./components/text-message";

export default function RoomDetailsPage() {
  const onChatFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = formJson(e.currentTarget);

    showSwal("success", JSON.stringify(formData, null, 2));
  };

  return (
    <section className="py-5 container">
      <div className="row">
        <div className="col-lg-3 col-md-3 col-sm-12">
          <ListGroup>
            <ListGroup.Item
              action
              variant="light"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="me-auto">
                <div className="fw-bold">Subheading</div>
              </div>
              <Badge bg="primary" pill>
                14
              </Badge>
            </ListGroup.Item>

            <ListGroup.Item
              action
              variant="light"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="me-auto">
                <div className="fw-bold">Subheading</div>
              </div>
              <Badge bg="primary" pill>
                14
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item
              action
              variant="light"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="me-auto">
                <div className="fw-bold">Subheading</div>
              </div>
              <Badge bg="primary" pill>
                14
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item
              action
              variant="light"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="me-auto">
                <div className="fw-bold">Subheading</div>
              </div>
              <Badge bg="primary" pill>
                14
              </Badge>
            </ListGroup.Item>
          </ListGroup>
        </div>
        <div className="col-lg-9 col-md-9 col-sm-12">
          <Card>
            <Card.Body>
              <TextMessage sender_name="Emir" message="Merhaba" />
              <TextMessage sender_name="Ahmet" message="Merhaba" />
              <TextMessage sender_name="Mehmet" message="Merhaba" />
              <TextMessage sender_name="Ayşe" message="Merhaba" />
              <TextMessage sender_name="Fatma" message="Merhaba" />
            </Card.Body>
            <Card.Footer>
              <Form onSubmit={onChatFormSubmit}>
                <InputGroup>
                  <Form.Control
                    name="message"
                    as="input"
                    aria-label="With textarea"
                  />
                  <Button type="submit" variant="primary">
                    Gönder
                  </Button>
                </InputGroup>
              </Form>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </section>
  );
}
