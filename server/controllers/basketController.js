const { Basket, BasketDevice, Device } = require("../models/models");
const ApiError = require("../error/ApiError");

class BasketController {
  async addDevice(req, res, next) {
    try {
      const userId = req.user.id;
      const { deviceId } = req.body;

      const basket = await Basket.findOne({ where: { userId } });
      if (!basket) {
        return next(ApiError.internal("Корзина пользователя не найдена"));
      }

      const basketDevice = await BasketDevice.create({
        basketId: basket.id,
        deviceId,
      });

      return res.json(basketDevice);
    } catch (e) {
      return next(ApiError.internal("Ошибка при добавлении в корзину"));
    }
  }

  async getBasket(req, res, next) {
    try {
      const userId = req.user.id;
      const basket = await Basket.findOne({ where: { userId } });
      if (!basket) {
        return next(ApiError.internal("Корзина пользователя не найдена"));
      }

      const items = await BasketDevice.findAll({
        where: { basketId: basket.id },
        include: [{ model: Device }],
      });

      return res.json(items);
    } catch (e) {
      return next(ApiError.internal("Ошибка при получении корзины"));
    }
  }
  async removeDevice(req, res, next) {
    try {
      const userId = req.user.id;
      const { deviceId } = req.body;

      const basket = await Basket.findOne({ where: { userId } });
      if (!basket) {
        return next(ApiError.internal("Корзина не найдена"));
      }

      await BasketDevice.destroy({
        where: {
          basketId: basket.id,
          deviceId,
        },
      });

      return res.json({ message: "Удалено из корзины" });
    } catch (e) {
      return next(ApiError.internal("Ошибка удаления"));
    }
  }
}

module.exports = new BasketController();
