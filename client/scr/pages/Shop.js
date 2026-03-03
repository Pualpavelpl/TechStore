import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import TypeBar from "../components/TypeBar";
import BrandBar from "../components/BrandBar";
import DeviceList from "../components/DeviceList";
import DeviceItem from "../components/DeviceItem";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceAPI";
import Pages from "../components/Pages";
import { useNavigate } from "react-router-dom";
import { SHOP_ROUTE } from "../utils/consts";
import CreateType from "../components/modals/CreateType";
import CreateBrand from "../components/modals/CreateBrand";
import CreateDevice from "../components/modals/CreateDevice";

const Shop = observer(() => {
  const { device, user } = useContext(Context);
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [brandVisible, setBrandVisible] = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);

  const isAdmin = user.isAuth && user.user?.role === "ADMIN";

  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));
    fetchBrands().then((data) => device.setBrands(data));
    fetchDevices(null, null, 1, 12).then((data) => {
      device.setDevices(data.rows);
      device.setTotalCount(data.count);
    });
  }, []);

  useEffect(() => {
    fetchDevices(
      device.selectedType.id,
      device.selectedBrand.id,
      device.page,
      12
    ).then((data) => {
      device.setDevices(data.rows);
      device.setTotalCount(data.count);
    });
  }, [device.page, device.selectedType, device.selectedBrand]);

  const allDevices = device.devices || [];
  const maxPriceFromList =
    allDevices.length > 0
      ? Math.max(...allDevices.map((d) => Number(d.price) || 0))
      : 10000;
  const hits = [...allDevices]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);
  const newArrivals = [...allDevices]
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 4);

  return (
    <Container className="page-content mt-4 mb-5">
      <div className="hero-section mb-4">
        <h1 className="hero-title">Техника для дома и офиса</h1>
        <p className="hero-subtitle mb-3">
          Смартфоны, ноутбуки, телевизоры, холодильники и стиральные машины от
          ведущих брендов. Доставка по всей Беларуси, гарантия, рассрочка 0%.
        </p>
        <Button
          variant="light"
          size="lg"
          className="btn-store"
          onClick={() => navigate(SHOP_ROUTE)}
        >
          Смотреть каталог
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={12}>
          <h2 className="page-section-title mb-3">Преимущества</h2>
          <div className="advantage-list">
            <Card className="advantage-card">
              <Card.Body>
                <strong>Бесплатная доставка</strong>
                <p className="text-muted mb-0 small">
                  По Минску от 500 BYN, по РБ от 300 BYN до ПВЗ.
                </p>
              </Card.Body>
            </Card>
            <Card className="advantage-card">
              <Card.Body>
                <strong>Гарантия 2 года</strong>
                <p className="text-muted mb-0 small">
                  Расширенная гарантия на отдельные категории товаров.
                </p>
              </Card.Body>
            </Card>
            <Card className="advantage-card">
              <Card.Body>
                <strong>Официальные бренды</strong>
                <p className="text-muted mb-0 small">
                  Только сертифицированные поставщики и оригинальная техника.
                </p>
              </Card.Body>
            </Card>
            <Card className="advantage-card">
              <Card.Body>
                <strong>Рассрочка 0%</strong>
                <p className="text-muted mb-0 small">
                  Оформление рассрочки без переплат через банки-партнёры.
                </p>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      <Card className="card-modern p-4 mb-4 bg-primary text-white">
        <h3 className="h5 mb-2">Акции</h3>
        <p className="mb-0">
          Скидки до 15% на отдельные категории. Бесплатная доставка при заказе
          от 500 BYN по Минску.
        </p>
      </Card>

      <div className="mb-4 filters-block">
        <Button
          variant="outline-primary"
          size="lg"
          className="filters-block__btn"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          {showFilters ? "Скрыть фильтры" : "Фильтры"}
        </Button>
        {showFilters && (
          <Card className="card-modern p-3 mt-2 filter-panel">
            <Row>
              <Col md={6} lg={4}>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-100 mb-3"
                  onClick={() => {
                    device.setSelectedType({});
                    device.setSelectedBrand({});
                    device.resetFilters();
                  }}
                >
                  Все товары
                </Button>
                <h5 className="mb-2">Категория</h5>
                <TypeBar />
                <hr />
                <h5 className="mb-2">Бренд</h5>
                <BrandBar />
              </Col>
              <Col md={6} lg={4}>
                <h5 className="mb-2">Цена, BYN</h5>
                <Row className="g-2">
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="От"
                      value={device.minPrice || ""}
                      onChange={(e) =>
                        device.setMinPrice(Number(e.target.value) || 0)
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="До"
                      value={
                        device.maxPrice === 0
                          ? maxPriceFromList
                          : device.maxPrice
                      }
                      onChange={(e) =>
                        device.setMaxPrice(Number(e.target.value) || 0)
                      }
                    />
                  </Col>
                </Row>
                <hr />
                <h5 className="mb-2">Рейтинг</h5>
                <Form.Select
                  value={device.minRating}
                  onChange={(e) => device.setMinRating(Number(e.target.value))}
                >
                  <option value={0}>Любой</option>
                  <option value={4}>От 4</option>
                  <option value={4.5}>От 4.5</option>
                  <option value={4.8}>От 4.8</option>
                </Form.Select>
                <hr />
                <Form.Check
                  type="checkbox"
                  id="onlyNew"
                  label="Только новинки"
                  checked={device.onlyNew}
                  onChange={(e) => device.setOnlyNew(e.target.checked)}
                />
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="mt-2 w-100"
                  onClick={() => device.resetFilters()}
                >
                  Сбросить фильтры
                </Button>
              </Col>
              {isAdmin && (
                <Col md={12} lg={4}>
                  <Card className="card-modern p-3 h-100">
                    <h5 className="mb-2">Добавить</h5>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      className="w-100 mb-1"
                      onClick={() => setTypeVisible(true)}
                    >
                      Добавить тип
                    </Button>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      className="w-100 mb-1"
                      onClick={() => setBrandVisible(true)}
                    >
                      Добавить бренд
                    </Button>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      className="w-100"
                      onClick={() => setDeviceVisible(true)}
                    >
                      Добавить устройство
                    </Button>
                  </Card>
                </Col>
              )}
            </Row>
          </Card>
        )}
      </div>

      {hits.length > 0 && (
        <div className="mb-4">
          <h2 className="page-section-title mb-3">Хиты продаж</h2>
          <Row>
            {hits.map((d, i) => (
              <DeviceItem key={d.id} device={d} index={i} />
            ))}
          </Row>
        </div>
      )}

      {newArrivals.length > 0 && (
        <div className="mb-4">
          <h2 className="page-section-title mb-3">Новые поступления</h2>
          <Row>
            {newArrivals.map((d, i) => (
              <DeviceItem key={d.id} device={d} index={i + 4} />
            ))}
          </Row>
        </div>
      )}

      <div className="catalog-section">
        <h2 className="page-section-title mb-3">Каталог</h2>
        <DeviceList />
        <Pages />
      </div>

      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
      <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
      <CreateDevice
        show={deviceVisible}
        onHide={() => setDeviceVisible(false)}
      />
    </Container>
  );
});

export default Shop;
