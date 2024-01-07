import { formToJSON } from "axios";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  CreateRoomDataType,
  createRoomService,
} from "../../../redux/slice/roomSlice";
import { formJson } from "../../../utils/functions";

export default function CreateRoomPage() {
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(">> Axios formToJSON: ", formToJSON(event.currentTarget));

    const value = formJson<CreateRoomDataType>(event.currentTarget);
    console.log(">> 🚀 file: index.tsx:12 🚀 value:", value);

    /*
{
    "status": "success",
    "data": {
        "room": {
            "userId": "65880eda3966777fdb7cbd12",
            "name": "test",
            "visibility": "public",
            "maxClient": 0,
            "peers": [],
            "_id": "659a71adceac45d4e6c24bc9",
            "__v": 0
        }
    }
}
*/
    const result = await createRoomService(value);
    if (result) {
      navigate("/room/" + result._id);
    }
  };

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
          <Form onSubmit={onSubmit}>
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
            <Form.Group className="mb-3" controlId="room.maxClient">
              <Form.Label>Maximum Kaç Kişi Katılabilsin?</Form.Label>
              <Form.Control
                type="number"
                name="maxClient"
                placeholder="Kaç kişi katılsın?"
                defaultValue={0}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="room.name">
              <Button type="submit" variant="primary">
                Gönder
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </section>
  );
}
