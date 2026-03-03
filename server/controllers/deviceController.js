const uuid = require("uuid");
const path = require("path");
const { Device, DeviceInfo, Brand, Type } = require("../models/models");
const ApiError = require("../error/ApiError");
const { title } = require("process");

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, typeId, brandId, info } = req.body;
      let fileName = "";
      if (req.files && req.files.img) {
        const { img } = req.files;
        fileName = uuid.v4() + ".jpg";
        img.mv(path.resolve(__dirname, "..", "static", fileName));
      }
      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });
      if (info) {
        info = JSON.parse(info);
        info.forEach((i) =>
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id,
          })
        );
      }

      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      let { brandId, typeId, limit, page } = req.query;

      if (brandId === "null" || brandId === "undefined") {
        brandId = null;
      }
      if (typeId === "null" || typeId === "undefined") {
        typeId = null;
      }

      page = Number(page) || 1;
      limit = Number(limit) || 9;
      let offset = page * limit - limit;

      let devices;

      if (!brandId && !typeId) {
        devices = await Device.findAndCountAll({
          limit,
          offset,
          include: [{ model: Brand }, { model: Type }],
        });
      }

      if (brandId && !typeId) {
        devices = await Device.findAndCountAll({
          where: { brandId },
          limit,
          offset,
          include: [{ model: Brand }, { model: Type }],
        });
      }

      if (!brandId && typeId) {
        devices = await Device.findAndCountAll({
          where: { typeId },
          limit,
          offset,
          include: [{ model: Brand }, { model: Type }],
        });
      }

      if (brandId && typeId) {
        devices = await Device.findAndCountAll({
          where: { brandId, typeId },
          limit,
          offset,
          include: [{ model: Brand }, { model: Type }],
        });
      }

      return res.json(devices);
    } catch (e) {
      return next(ApiError.internal("Ошибка получения устройств"));
    }
  }

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });
    return res.json(device);
  }
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { typeId, brandId } = req.body;

      const device = await Device.update(
        { typeId, brandId },
        { where: { id } }
      );
      return res.json({ message: "Update successfull" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new DeviceController();
