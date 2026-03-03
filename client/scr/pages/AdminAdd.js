import React, { useContext, useState } from "react";
import { Button, Container, Card } from "react-bootstrap";
import CreateBrand from "../components/modals/CreateBrand";
import CreateDevice from "../components/modals/CreateDevice";
import CreateType from "../components/modals/CreateType";
import { Context } from "../index";
import { useNavigate } from "react-router-dom";
import { SHOP_ROUTE } from "../utils/consts";

const AdminAdd = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [brandVisible, setBrandVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);

  const isAdmin = user.isAuth && user.user?.role === "ADMIN";

  if (!isAdmin) {
    return (
      <Container className="page-content mt-4 mb-5">
        <Card className="card-modern p-4">
          <p className="mb-3">Нет доступа. Только для администратора.</p>
          <Button variant="primary" onClick={() => navigate(SHOP_ROUTE)}>
            На главную
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="page-content mt-4 mb-5">
      <h1 className="mb-4">Добавление в каталог</h1>
      <Card className="card-modern p-4">
        <h2 className="h5 mb-3">Добавить тип, бренд или устройство</h2>
        <p className="text-muted mb-4">
          Выберите, что хотите добавить: новую категорию (тип), бренд или товар
          (устройство).
        </p>
        <div className="d-flex flex-wrap gap-2">
          <Button
            variant="outline-primary"
            className="btn-store"
            onClick={() => setTypeVisible(true)}
          >
            Добавить тип
          </Button>
          <Button
            variant="outline-primary"
            className="btn-store"
            onClick={() => setBrandVisible(true)}
          >
            Добавить бренд
          </Button>
          <Button
            variant="outline-primary"
            className="btn-store"
            onClick={() => setDeviceVisible(true)}
          >
            Добавить устройство
          </Button>
        </div>
      </Card>
      <Button
        variant="outline-secondary"
        className="mt-3"
        onClick={() => navigate(SHOP_ROUTE)}
      >
        На главную
      </Button>
      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
      <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
      <CreateDevice
        show={deviceVisible}
        onHide={() => setDeviceVisible(false)}
      />
    </Container>
  );
};

export default AdminAdd;
