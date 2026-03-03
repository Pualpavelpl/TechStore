import React from "react";
import { Card, Col, Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/consts";
import { addToBasket } from "../http/deviceAPI";
import { useContext } from "react";
import { Context } from "../index";

function StarRating({ value }) {
  const v = Number(value) || 0;
  const full = Math.floor(v);
  const half = v - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="star-rating" style={{ fontSize: "0.9rem" }}>
      {"★".repeat(full)}
      {half ? "☆" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

const DeviceItem = ({ device, index = 0 }) => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const brandName = device.brand?.name || "";
  const typeName = device.type?.name || "";
  const shortDesc =
    `${device.name} — надёжная модель с хорошим соотношением цены и качества. Подходит для повседневного использования.`.slice(
      0,
      100
    ) + "…";

  const isHit = device.rating >= 4.7;
  const isNew = device.id >= 50;
  const isSale = device.id % 3 === 0;

  const handleAddToBasket = async (e) => {
    e.stopPropagation();
    if (!user.isAuth) {
      alert("Необходимо авторизоваться");
      return;
    }
    try {
      await addToBasket(device.id);
      alert("Товар добавлен в корзину");
    } catch (err) {
      alert("Ошибка добавления");
    }
  };

  return (
    <Col
      xs={12}
      sm={6}
      md={4}
      lg={3}
      className="mt-3 device-item-wrap d-flex justify-content-center"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <Card
        className="device-card h-100 w-100"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(DEVICE_ROUTE + "/" + device.id)}
      >
        <div className="position-relative device-card__img-wrap">
          <div className="device-card__badges">
            {isHit && <span className="badge-hit">Хит</span>}
            {isNew && <span className="badge-new">Новинка</span>}
            {isSale && !isHit && !isNew && (
              <span className="badge-sale">Скидка</span>
            )}
          </div>
          <Image
            fluid
            className="device-card__img"
            src={
              device.img
                ? process.env.REACT_APP_API_URL + device.img
                : "https://via.placeholder.com/200x200?text=Нет+фото"
            }
            alt={device.name}
          />
        </div>
        <Card.Body className="d-flex flex-column">
          <div className="text-muted small mb-1">
            {brandName} {typeName && `· ${typeName}`}
          </div>
          <Card.Title className="h6 mb-1">{device.name}</Card.Title>
          <p
            className="small text-muted mb-2 flex-grow-1"
            style={{ minHeight: "2.5em" }}
          >
            {shortDesc}
          </p>
          <div className="d-flex align-items-center mb-2">
            <StarRating value={device.rating} />
            <span className="ms-1 small text-muted">
              ({device.reviewsCount || 0})
            </span>
          </div>
          <div className="price mb-2">
            {device.price != null ? Number(device.price).toLocaleString() : "—"}{" "}
            BYN
          </div>
          <div className="d-flex gap-1 mt-auto">
            <Button
              variant="outline-primary"
              size="sm"
              className="flex-grow-1 btn-store"
              onClick={(e) => {
                e.stopPropagation();
                navigate(DEVICE_ROUTE + "/" + device.id);
              }}
            >
              Подробнее
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="btn-store"
              onClick={handleAddToBasket}
            >
              В корзину
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default DeviceItem;
