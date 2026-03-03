import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__columns">
          <div className="site-footer__col">
            <h5 className="site-footer__title">О компании</h5>
            <p className="site-footer__text">
              TechStore — интернет-магазин бытовой техники и электроники. Мы
              работаем с официальными поставщиками и предлагаем гарантию,
              доставку по всей Беларуси и рассрочку без переплат.
            </p>
          </div>
          <div className="site-footer__col">
            <h5 className="site-footer__title">Покупателям</h5>
            <p className="site-footer__text">Доставка и оплата</p>
            <p className="site-footer__text">Гарантия и возврат</p>
            <p className="site-footer__text">Рассрочка 0%</p>
            <p className="site-footer__text">Акции и скидки</p>
          </div>
          <div className="site-footer__col">
            <h5 className="site-footer__title">Контакты</h5>
            <p className="site-footer__text">+375 (29) 000-00-00</p>
            <p className="site-footer__text">info@techstore.by</p>
            <p className="site-footer__text">Ежедневно с 10:00 до 22:00</p>
          </div>
          <div className="site-footer__col">
            <h5 className="site-footer__title">Соцсети</h5>
            <p className="site-footer__text">VK · Telegram</p>
          </div>
        </div>
        <Row className="site-footer__bottom">
          <Col>© 2026 TechStore. Все права защищены.</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
