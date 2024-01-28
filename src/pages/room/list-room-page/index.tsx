import { FormEvent, useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Navbar,
  Pagination,
  Row,
} from "react-bootstrap";
import RoomBox from "../../../components/room-box";
import { ChatApiResponseType, chatHttpApi } from "../../../utils/api";
import { formJson } from "../../../utils/functions";

export default function ListRoomPage() {
  const searchFormRef = useRef<any>();

  // TODO Pagination data'nın type'ını doğru şekilde belirt, any'yi kaldır.
  const [paginationData, setPaginationData] = useState<any | null | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const expand = "lg";

  let items = [];
  let totalPage = 0;
  if (paginationData) {
    totalPage = Math.ceil(
      paginationData.pagination.recordsTotal /
        paginationData.pagination.recordsPerPage
    );
  }

  for (let pageNo = 1; pageNo <= totalPage; pageNo++) {
    items.push(
      <Pagination.Item
        onClick={() => setCurrentPage(pageNo)}
        key={pageNo}
        active={pageNo === currentPage}
      >
        {pageNo}
      </Pagination.Item>
    );
  }

  /* Search işlemini hem component mount olduğunda hem search form submit
  olduğunda hem de pagination linklerine tıklandığında yapacağımız için
  bunu ayrı bir fonksiyona aldık. Bundan dolayı da search formuna ulaşabilmek
  için bir adet ref oluşturduk (searchFormRef). */
  const searchRoom = async () => {
    /* Formu burada komple json objesine çeviriyoruz. Sonra haricen gelen
    currentPage datasını da bu objeye ekliyoruz. */
    const searchData = formJson(searchFormRef.current);
    searchData.page_no = currentPage;

    console.log(">> 🚀 searchData:", searchData);

    setPaginationData(undefined);

    const api = chatHttpApi();
    const result = await api.post<ChatApiResponseType<any>>(
      "room/list",
      searchData
    );
    console.log(">> 🚀 result:", result.data);

    if (result.data.status === "success") {
      setPaginationData(result.data.data);
    } else {
      setErrorMessage(result.data.errorMessage);
    }
  };

  const onSearchFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentPage === 1) {
      searchRoom();
    } else {
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    searchRoom();
  }, []);

  useEffect(() => {
    searchRoom();
  }, [currentPage]);

  return (
    <section className="py-5 container">
      <Navbar expand={expand} className="bg-body-tertiary mb-3">
        <Container fluid>
          <Navbar className="bg-body-tertiary">
            <Form ref={searchFormRef} onSubmit={onSearchFormSubmit}>
              <Row>
                <Col xs="auto">
                  Oda İsmi:
                  <Form.Control
                    type="text"
                    placeholder="Oda İsmi"
                    className="mr-sm-2"
                    name="room_name"
                  />
                </Col>
                <Col xs="auto">
                  Tarihe Göre:
                  <Form.Select name="create_date_order">
                    <option>-</option>
                    <option value="asc">Artan</option>
                    <option value="desc">Azalan</option>
                  </Form.Select>
                </Col>

                <Col xs="auto">
                  İsme Göre:
                  <Form.Select name="name_order">
                    <option>-</option>
                    <option value="asc">Artan</option>
                    <option value="desc">Azalan</option>
                  </Form.Select>
                </Col>

                <Col xs="auto">
                  &nbsp;
                  <br />
                  <Button type="submit">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    &nbsp; Ara
                  </Button>
                </Col>
              </Row>
            </Form>
          </Navbar>
        </Container>
      </Navbar>

      <div className="row pt-lg-5">
        <div className="col-lg-12">
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {typeof paginationData === "undefined" ? (
              <strong>Loading...</strong>
            ) : null}

            {paginationData === null ? (
              <strong>
                Hiç oda mevcut değil, lütfen bir adet oda oluşturunuz...
              </strong>
            ) : null}

            {paginationData?.items.map((item: any, index: any) => {
              return <RoomBox room={item} key={index} />;
            })}
          </Row>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <Pagination className="justify-content-center">
            <Pagination.First />
            <Pagination.Prev />

            {items}
            <Pagination.Next />
            <Pagination.Last />
          </Pagination>
        </div>
      </div>
    </section>
  );
}
