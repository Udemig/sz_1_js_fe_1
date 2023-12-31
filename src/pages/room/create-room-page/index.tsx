import { Button, Form } from "react-bootstrap";

export default function CreateRoomPage() {
  return (
    <section className="py-5 text-center container">
      <div className="row pt-lg-5">
        <div className="col-lg-6 col-md-8 mx-auto">
          <h1 className="fw-light">Buradan yeni oda oluşturabilirsiniz.</h1>
          <p className="lead text-body-secondary">
            Oda kuralları: Lütfen saygılı olalım.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-8 mx-auto">
          <Form>
            <Form.Group className="mb-3" controlId="room.name">
              <Form.Label>Oda İsmi:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Lütfen oda ismini giriniz"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="room.visibility">
              <Form.Label>Görünürlük:</Form.Label>
              <br />
              <Form.Check
                inline
                label="Herkese Açık"
                name="visibility"
                type="radio"
                value={"public"}
                id={`visibilityPublic`}
              />
              <Form.Check
                inline
                label="Gizli"
                name="visibility"
                type="radio"
                value={"private"}
                id={`visibilityPrivate`}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="room.name">
              <Form.Label>Oda İsmi:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Lütfen oda ismini giriniz"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="room.name">
              <Button variant="primary">Gönder</Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </section>
  );
}
