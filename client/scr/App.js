import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import { Spinner } from "react-bootstrap";
import "./styles/main.css";

const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);
  console.log("API:", process.env.REACT_APP_API_URL);

  useEffect(() => {
    // Добавлена проверка, чтобы не падать при ошибке 401
    check()
      .then((data) => {
        user.setUser(data); // Передаем данные пользователя, а не просто true
        user.setIsAuth(true);
      })
      .catch(() => {
        user.setIsAuth(false);
      })
      .finally(() => setLoading(false));
  }, []); // <--- ОБЯЗАТЕЛЬНО пустой массив, чтобы сработало один раз

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation={"grow"} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-wrap">
        <NavBar />
        <main className="app-main">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
});

export default App;
