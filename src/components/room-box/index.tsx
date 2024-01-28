import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RoomType } from "../../redux/slice/roomSlice";

export type RoomBoxPropsType = {
  room: RoomType;
};

export default function RoomBox(props: RoomBoxPropsType) {
  return (
    <Col>
      <Card className="text-center">
        <Card.Body
          style={{
            padding: "50px 10px",
            backgroundColor: "#55595c",
            color: "white",
          }}
        >
          {props.room.name}
        </Card.Body>
        <Card.Footer>
          <Link to={"/room/" + props.room._id} className="btn btn-primary">
            <i className="fa-solid fa-right-to-bracket"></i>
            &nbsp; Odaya Katıl
          </Link>
        </Card.Footer>
      </Card>
    </Col>
  );
}
