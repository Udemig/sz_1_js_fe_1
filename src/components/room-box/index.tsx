import { Link } from "react-router-dom";
import { RoomType } from "../../redux/slice/roomSlice";

export type RoomBoxPropsType = {
  room: RoomType;
};

export default function RoomBox(props: RoomBoxPropsType) {
  return (
    <div className="col">
      <div className="card shadow-sm">
        <svg
          className="bd-placeholder-img card-img-top"
          width="100%"
          height="225"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Placeholder: Thumbnail"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <title>Placeholder</title>
          <rect width="100%" height="100%" fill="#55595c" />
          <text x="50%" y="50%" fill="#eceeef" dy=".3em">
            {props.room.name}
          </text>
        </svg>
        <div className="card-body">
          <p className="card-text"></p>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <Link to={"/room/" + props.room._id} className="btn btn-primary">
                <i className="fa-solid fa-right-to-bracket"></i>
                &nbsp; Odaya Katıl
              </Link>
            </div>
            <small className="text-body-secondary">9 mins</small>
          </div>
        </div>
      </div>
    </div>
  );
}
