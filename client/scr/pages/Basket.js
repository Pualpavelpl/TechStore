import React, { useEffect, useState } from "react";
import { fetchBasket, removeFromBasket } from "../http/deviceAPI";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/consts";

const Basket = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const loadBasket = () => {
    fetchBasket()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    loadBasket();
  }, []);

  const totalPrice = items.reduce(
    (sum, item) => sum + (item.device?.price ?? 0),
    0
  );

  const handleRemove = async (e, deviceId) => {
    e.stopPropagation();
    try {
      await removeFromBasket(deviceId);
      loadBasket();
    } catch (err) {
      alert("Ошибка удаления");
    }
  };

  return (
    <Container className="page-content mt-4 mb-5">
      <h1>Корзина</h1>

      {items.map((item) => (
        <Card
          key={item.id}
          className="mb-3 p-3 basket-item-click card-modern"
          onClick={() =>
            item.device?.id && navigate(DEVICE_ROUTE + "/" + item.device.id)
          }
        >
          <Row className="align-items-center">
            <Col md={3}>
              <img
                width={100}
                src={
                  item.device?.img
                    ? process.env.REACT_APP_API_URL + item.device.img
                    : "https://via.placeholder.com/100?text=Нет+фото"
                }
                alt=""
              />
            </Col>
            <Col md={6}>
              <h5>{item.device?.name}</h5>
              <p className="mb-0">
                Цена:{" "}
                {item.device?.price != null
                  ? Number(item.device.price).toLocaleString()
                  : "—"}{" "}
                BYN
              </p>
            </Col>
            <Col md={3} className="text-end">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={(e) =>
                  item.device?.id && handleRemove(e, item.device.id)
                }
              >
                Удалить из корзины
              </Button>
            </Col>
          </Row>
        </Card>
      ))}

      <h3 className="mt-4">Общая сумма: {totalPrice.toLocaleString()} BYN</h3>

      <Button variant="dark" className="mt-3" disabled={items.length === 0}>
        Оформить заказ
      </Button>
    </Container>
  );
};

export default Basket;
