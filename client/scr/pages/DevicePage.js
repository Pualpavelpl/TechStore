import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
  Table,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOneDevice, addToBasket, fetchDevices } from "../http/deviceAPI";
import { useContext } from "react";
import { Context } from "../index";
import { DEVICE_ROUTE } from "../utils/consts";

function StarRating({ value }) {
  const v = Number(value) || 0;
  const full = Math.floor(v);
  const half = v - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="star-rating" aria-label={`Рейтинг ${v}`}>
      {"★".repeat(full)}
      {half ? "☆" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

const RECENT_KEY = "recentDevices";
const RECENT_MAX = 5;

const DevicePage = () => {
  const [device, setDevice] = useState({ info: [] });
  const [adding, setAdding] = useState(false);
  const [similarDevices, setSimilarDevices] = useState([]);
  const [recentDevices, setRecentDevices] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(Context);

  useEffect(() => {
    fetchOneDevice(id).then((data) => {
      setDevice(data);
      const recent = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      const next = [
        { id: data.id, name: data.name, price: data.price, img: data.img },
      ]
        .concat(recent.filter((r) => r.id !== data.id))
        .slice(0, RECENT_MAX);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      setRecentDevices(next.filter((r) => r.id !== data.id));
      if (data.typeId) {
        fetchDevices(data.typeId, null, 1, 5).then((res) => {
          const similar = (res.rows || [])
            .filter((d) => d.id !== data.id)
            .slice(0, 4);
          setSimilarDevices(similar);
        });
      }
    });
  }, [id]);

  const descriptionItem = device.info?.find((i) => i.title === "Описание");
  const specItems = device.info?.filter((i) => i.title !== "Описание") || [];
  const descriptionParagraphs = descriptionItem?.description
    ? descriptionItem.description.split(/\n\n+/)
    : [];

  const handleAddToBasket = async () => {
    if (!user.isAuth) {
      alert("Необходимо авторизоваться");
      return;
    }
    setAdding(true);
    try {
      await addToBasket(device.id);
      alert("Товар добавлен в корзину");
    } catch (e) {
      alert("Ошибка добавления");
    } finally {
      setAdding(false);
    }
  };

  const imgSrc = device.img
    ? process.env.REACT_APP_API_URL + device.img
    : "https://via.placeholder.com/400x400?text=Нет+фото";

  return (
    <Container className="device-page mt-4 mb-5">
      <Row className="device-page__top mb-4">
        <Col md={5} className="device-page__image-wrap">
          <Image src={imgSrc} fluid className="device-page__image" />
        </Col>
        <Col md={7}>
          <h1 className="device-page__title">{device.name}</h1>
          <div className="device-page__rating mb-2">
            <StarRating value={device.rating} />
            <span className="ms-2 text-muted">
              {device.rating != null ? Number(device.rating).toFixed(1) : "—"} ·{" "}
              {device.reviewsCount || 0} отзывов
            </span>
          </div>
          <div className="device-page__price mb-4">
            От:{" "}
            {device.price != null ? Number(device.price).toLocaleString() : "—"}{" "}
            BYN
          </div>
          <div className="d-flex flex-wrap gap-2 mb-4">
            <Button
              variant="primary"
              size="lg"
              className="btn-store"
              onClick={handleAddToBasket}
              disabled={adding}
            >
              {adding ? "Добавляем…" : "В корзину"}
            </Button>
            <Button variant="outline-primary" size="lg" className="btn-store">
              Купить в 1 клик
            </Button>
          </div>
          {descriptionParagraphs.length > 0 && (
            <p className="device-page__short-desc text-muted">
              {descriptionParagraphs[0]}
            </p>
          )}
        </Col>
      </Row>

      <Tabs defaultActiveKey="description" className="device-tabs mb-4">
        <Tab eventKey="description" title="Описание">
          <Card className="card-modern p-4">
            <h3 className="mb-3">Описание</h3>
            {descriptionParagraphs.length > 0 ? (
              descriptionParagraphs.map((p, i) => (
                <p key={i} className="device-page__paragraph">
                  {p}
                </p>
              ))
            ) : (
              <p>Описание товара готовится.</p>
            )}
          </Card>
        </Tab>
        <Tab eventKey="specs" title="Характеристики">
          <Card className="card-modern p-4">
            <h3 className="mb-3">Характеристики</h3>
            <Table bordered hover className="spec-table">
              <tbody>
                {specItems.map((row) => (
                  <tr key={row.id}>
                    <td className="spec-table__name">{row.title}</td>
                    <td>{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Tab>
        <Tab eventKey="delivery" title="Доставка">
          <Card className="card-modern p-4">
            <h3 className="mb-3">Доставка</h3>
            <p>
              Курьером по Минску — 1–2 дня. По Беларуси — 2–5 дней в зависимости
              от региона.
            </p>
            <p>
              Самовывоз из пунктов выдачи и розничных магазинов — в день заказа
              при наличии.
            </p>
            <p>Бесплатная доставка при заказе от 500 BYN по Минску.</p>
          </Card>
        </Tab>
        <Tab eventKey="reviews" title="Отзывы">
          <Card className="card-modern p-4">
            <h3 className="mb-3">Отзывы</h3>
            <p className="text-muted">Раздел отзывов в разработке.</p>
          </Card>
        </Tab>
      </Tabs>

      <Card className="card-modern p-4 why-buy">
        <h3 className="mb-3">Почему стоит купить у нас?</h3>
        <Row>
          <Col md={4}>
            <div className="why-buy__item">
              <strong>Гарантия</strong>
              <p className="mb-0 text-muted">
                Официальная гарантия производителя, сервисные центры по всей
                стране.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="why-buy__item">
              <strong>Быстрая доставка</strong>
              <p className="mb-0 text-muted">
                Курьером или самовывоз. Отправка в день заказа при наличии на
                складе.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="why-buy__item">
              <strong>Официальные поставщики</strong>
              <p className="mb-0 text-muted">
                Работаем только с официальными дистрибьюторами, без серого
                импорта.
              </p>
            </div>
          </Col>
        </Row>
      </Card>

      {similarDevices.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-3">Похожие товары</h3>
          <Row>
            {similarDevices.map((d) => (
              <Col md={3} key={d.id} className="mb-3">
                <Card
                  className="device-card h-100"
                  onClick={() => navigate(DEVICE_ROUTE + "/" + d.id)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Img
                    variant="top"
                    style={{ height: 160, objectFit: "contain" }}
                    src={
                      d.img
                        ? process.env.REACT_APP_API_URL + d.img
                        : "https://via.placeholder.com/200?text=Нет+фото"
                    }
                  />
                  <Card.Body>
                    <Card.Title className="h6">{d.name}</Card.Title>
                    <div className="price">
                      {d.price != null ? Number(d.price).toLocaleString() : "—"}{" "}
                      BYN
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {recentDevices.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-3">Вы недавно смотрели</h3>
          <Row>
            {recentDevices.map((r) => (
              <Col md={3} key={r.id} className="mb-3">
                <Card
                  className="device-card h-100"
                  onClick={() => navigate(DEVICE_ROUTE + "/" + r.id)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Img
                    variant="top"
                    style={{ height: 120, objectFit: "contain" }}
                    src={
                      r.img
                        ? process.env.REACT_APP_API_URL + r.img
                        : "https://via.placeholder.com/200?text=Нет+фото"
                    }
                  />
                  <Card.Body>
                    <Card.Title className="h6">{r.name}</Card.Title>
                    <div className="price">
                      {r.price != null ? Number(r.price).toLocaleString() : "—"}{" "}
                      BYN
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
};

export default DevicePage;
