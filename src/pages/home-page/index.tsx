import RoomBox from "../../components/room-box";

export default function HomePage() {
  return (
    <>
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">Welcome To Our Chat Site</h1>
            <p className="lead text-body-secondary">
              Welcome to the only and real address of quality chat.
            </p>
            <p>
              <a href="#" className="btn btn-primary mx-1">
                Main call to action
              </a>
              <a href="#" className="btn btn-secondary mx-1">
                Secondary action
              </a>
            </p>
          </div>
        </div>
      </section>

      <div className="album py-5 bg-body-tertiary">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            <RoomBox />
            <RoomBox />
            <RoomBox />
            <RoomBox />
            <RoomBox />
            <RoomBox />
          </div>
        </div>
      </div>
    </>
  );
}