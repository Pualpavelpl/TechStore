import React, { useContext, useEffect, useState } from "react";
import { Context } from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import {
  ADMIN_ROUTE,
  LOGIN_ROUTE,
  SHOP_ROUTE,
  BASKET_ROUTE,
} from "../utils/consts";
import { Button, Badge } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import { fetchBasket } from "../http/deviceAPI";

const NavBar = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [basketCount, setBasketCount] = useState(0);

  useEffect(() => {
    if (user.isAuth) {
      fetchBasket()
        .then((data) => setBasketCount(Array.isArray(data) ? data.length : 0))
        .catch(() => setBasketCount(0));
    } else {
      setBasketCount(0);
    }
  }, [user.isAuth]);

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.removeItem("token");
  };

  const showAdminButton = user.isAuth && user.user?.role === "ADMIN";

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      fixed="top"
      className="navbar-modern"
    >
      <Container>
        <Navbar.Brand
          as={NavLink}
          to={SHOP_ROUTE}
          className="navbar-modern__brand"
        >
          TechStore
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-modern-nav" />
        <Navbar.Collapse id="navbar-modern-nav">
          <Nav className="navbar-modern__center mx-auto">
            <Nav.Link as={NavLink} to={SHOP_ROUTE} end>
              Каталог
            </Nav.Link>
            <Nav.Link as={NavLink} to="/info">
              О компании
            </Nav.Link>
            <Nav.Link as={NavLink} to="/delivery">
              Доставка
            </Nav.Link>
            <Nav.Link as={NavLink} to="/info" className="d-lg-none">
              Контакты
            </Nav.Link>
          </Nav>
          <Nav className="navbar-modern__right">
            {showAdminButton && (
              <Button
                variant="outline-light"
                className="navbar-modern__btn me-2"
                onClick={() => navigate(ADMIN_ROUTE)}
              >
                Админ панель
              </Button>
            )}
            {user.isAuth && (
              <Button
                variant="outline-light"
                className="navbar-modern__btn me-2"
                onClick={() => navigate(BASKET_ROUTE)}
              >
                Корзина{" "}
                <Badge bg="light" text="dark">
                  {basketCount}
                </Badge>
              </Button>
            )}
            {user.isAuth ? (
              <Button
                variant="outline-light"
                className="navbar-modern__btn"
                onClick={logOut}
              >
                Выйти
              </Button>
            ) : (
              <Button
                variant="outline-light"
                className="navbar-modern__btn"
                onClick={() => navigate(LOGIN_ROUTE)}
              >
                Войти
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default NavBar;
