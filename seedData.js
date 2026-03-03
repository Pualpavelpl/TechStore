const {
  Type,
  Brand,
  Device,
  DeviceInfo,
  User,
  Basket,
} = require("../models/models");
const sequelize = require("../db");
const bcrypt = require("bcrypt");

function buildPhoneSpecs(name) {
  const specs = [
    { title: "Диагональ экрана", description: '6.7"' },
    { title: "Процессор", description: "Snapdragon 8 Gen 2" },
    { title: "Оперативная память", description: "8 ГБ" },
    { title: "Встроенная память", description: "256 ГБ" },
    { title: "Камера", description: "108 Мп" },
    { title: "Батарея", description: "5000 мАч" },
    { title: "NFC", description: "Да" },
    { title: "Экран", description: "Dynamic AMOLED 2X, 120 Гц" },
  ];
  if (name.includes("iPhone")) {
    specs[1].description = "Apple A17 Pro";
    specs[2].description = "8 ГБ";
    specs[4].description = "48 Мп + 12 Мп";
  }
  if (name.includes("A55")) {
    specs[0].description = '6.6"';
    specs[1].description = "Exynos 1480";
    specs[3].description = "128 ГБ";
  }
  if (name.includes("Redmi") || name.includes("Xiaomi 14")) {
    specs[1].description = "Dimensity 7200 / Snapdragon 8 Gen 2";
    specs[4].description = "200 Мп / 50 Мп";
  }
  return specs;
}

function buildLaptopSpecs(name) {
  return [
    { title: "Диагональ", description: '13.2" / 14.2" / 15.6"' },
    {
      title: "Процессор",
      description: "Apple M2 / Intel Core i5 / Intel Core i7 / AMD Ryzen 5",
    },
    { title: "Оперативная память", description: "8 ГБ / 16 ГБ" },
    { title: "Накопитель", description: "256 ГБ / 512 ГБ SSD" },
    { title: "Видеокарта", description: "Встроенная / NVIDIA RTX 4060" },
    { title: "Вес", description: "1.24 кг / 1.8–2.2 кг" },
    { title: "Операционная система", description: "macOS / Windows 11" },
  ];
}

function buildFridgeSpecs() {
  return [
    { title: "Объём", description: "350 л" },
    { title: "Класс энергопотребления", description: "A++" },
    { title: "Тип разморозки", description: "No Frost" },
    { title: "Высота", description: "185 см" },
    { title: "Ширина", description: "60 см" },
    { title: "Уровень шума", description: "38 дБ" },
    { title: "Зона свежести", description: "Да" },
    { title: "Инверторный компрессор", description: "Да" },
  ];
}

function buildTVSpecs(name) {
  const diag = name.includes("65")
    ? '65"'
    : name.includes("50")
    ? '50"'
    : '55"';
  return [
    { title: "Диагональ", description: diag },
    { title: "Разрешение", description: "4K UHD (3840×2160)" },
    { title: "Тип матрицы", description: "QLED / OLED / LED" },
    {
      title: "Smart TV",
      description: "Tizen / webOS / Google TV / Android TV",
    },
    { title: "HDR", description: "HDR10, HLG, Dolby Vision" },
    { title: "Частота обновления", description: "120 Гц" },
    { title: "Мощность звука", description: "20 Вт (2×10 Вт)" },
  ];
}

function buildWasherSpecs(name) {
  const kg = name.includes("8") ? "8" : "7";
  return [
    { title: "Макс. загрузка", description: `${kg} кг` },
    { title: "Класс энергопотребления", description: "A" },
    { title: "Отжим", description: "1200–1400 об/мин" },
    { title: "Глубина", description: "45–55 см" },
    { title: "Уровень шума (стирка/отжим)", description: "52/74 дБ" },
    { title: "Защита от протечек", description: "Да" },
    { title: "Отложенный старт", description: "Да" },
  ];
}

function longDescription(deviceName, typeName) {
  const paragraphs = [
    `${deviceName} — современная модель в линейке ${typeName}, сочетающая продуманный дизайн и актуальные технологии.`,
    `Производитель уделил особое внимание качеству материалов и сборки, что обеспечивает долгий срок службы устройства при интенсивной эксплуатации.`,
    `Функциональность рассчитана на повседневные задачи: от базового использования до ресурсоёмких сценариев.`,
    `Удобство использования подтверждают отзывы покупателей и высокие оценки в независимых тестах.`,
    `При покупке вы получаете официальную гарантию производителя и возможность сервисного обслуживания в авторизованных центрах.`,
    `Доставка по всей Беларуси осуществляется в кратчайшие сроки; возможен самовывоз из пунктов выдачи или розничных магазинов.`,
    `Оплата доступна банковской картой онлайн, при получении или в рассрочку 0% через банки-партнёры.`,
    `Мы сотрудничаем только с официальными поставщиками, поэтому гарантируем подлинность и соответствие заявленным характеристикам.`,
    `При возникновении вопросов вы можете обратиться в службу поддержки — мы поможем с выбором и оформлением заказа.`,
    `Благодарим за интерес к нашему магазину и желаем приятных покупок.`,
  ];
  return paragraphs.join("\n\n");
}

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const types = await Type.bulkCreate(
      [
        { name: "Смартфоны" },
        { name: "Ноутбуки" },
        { name: "Холодильники" },
        { name: "Телевизоры" },
        { name: "Стиральные машины" },
      ],
      { ignoreDuplicates: true }
    );

    const brands = await Brand.bulkCreate(
      [
        { name: "Samsung" },
        { name: "Apple" },
        { name: "Xiaomi" },
        { name: "LG" },
        { name: "Bosch" },
        { name: "Haier" },
        { name: "Sony" },
        { name: "HP" },
        { name: "Lenovo" },
        { name: "Asus" },
      ],
      { ignoreDuplicates: true }
    );

    const passwordHash = await bcrypt.hash("admin123", 5);
    const [admin] = await User.findOrCreate({
      where: { email: "admin@shop.local" },
      defaults: { password: passwordHash, role: "ADMIN" },
    });
    await Basket.findOrCreate({ where: { userId: admin.id } });

    const typeByName = {};
    const brandByName = {};
    (await Type.findAll()).forEach((t) => (typeByName[t.name] = t));
    (await Brand.findAll()).forEach((b) => (brandByName[b.name] = b));

    const devicesData = [];

    function addDevice(name, price, rating, reviewsCount, type, brand) {
      const t = typeByName[type];
      const b = brandByName[brand];
      if (!t || !b) return;
      devicesData.push({
        name,
        price,
        rating,
        reviewsCount: reviewsCount || 0,
        typeId: t.id,
        brandId: b.id,
        img: "",
      });
    }

    addDevice(
      "Samsung Galaxy S24 256GB (чёрный)",
      3699,
      4.9,
      187,
      "Смартфоны",
      "Samsung"
    );
    addDevice(
      "Samsung Galaxy A55 5G 128GB (синий)",
      1399,
      4.4,
      92,
      "Смартфоны",
      "Samsung"
    );
    addDevice(
      "Apple iPhone 15 128GB (чёрный)",
      3999,
      4.8,
      215,
      "Смартфоны",
      "Apple"
    );
    addDevice(
      "Apple iPhone 15 Pro 256GB (титан)",
      4899,
      4.9,
      163,
      "Смартфоны",
      "Apple"
    );
    addDevice(
      "Xiaomi Redmi Note 13 Pro 256GB",
      1299,
      4.6,
      134,
      "Смартфоны",
      "Xiaomi"
    );
    addDevice(
      "Xiaomi 14 256GB (зелёный)",
      2599,
      4.7,
      78,
      "Смартфоны",
      "Xiaomi"
    );

    addDevice(
      'Apple MacBook Air 13" M2 8/256',
      4299,
      4.9,
      84,
      "Ноутбуки",
      "Apple"
    );
    addDevice(
      'Apple MacBook Pro 14" M3 16/512',
      6699,
      4.8,
      41,
      "Ноутбуки",
      "Apple"
    );
    addDevice('HP Pavilion 15" i5 16/512', 2599, 4.3, 57, "Ноутбуки", "HP");
    addDevice(
      'Lenovo IdeaPad 3 15" Ryzen 5',
      1899,
      4.1,
      73,
      "Ноутбуки",
      "Lenovo"
    );
    addDevice(
      "Asus TUF Gaming F15 i7 RTX 4060",
      3499,
      4.7,
      65,
      "Ноутбуки",
      "Asus"
    );
    addDevice(
      "Samsung Galaxy Book4 i5 16/512",
      2899,
      4.5,
      39,
      "Ноутбуки",
      "Samsung"
    );

    addDevice(
      "Bosch Serie 4 двухкамерный No Frost",
      2199,
      4.8,
      52,
      "Холодильники",
      "Bosch"
    );
    addDevice(
      "Haier C2F636C двухкамерный",
      1799,
      4.3,
      28,
      "Холодильники",
      "Haier"
    );
    addDevice(
      "Samsung RB34 узкий холодильник",
      1899,
      4.6,
      44,
      "Холодильники",
      "Samsung"
    );
    addDevice(
      "LG DoorCooling+ двухкамерный",
      1999,
      4.4,
      31,
      "Холодильники",
      "LG"
    );
    addDevice(
      "Bosch Serie 6 XXL Side-by-Side",
      3699,
      4.9,
      19,
      "Холодильники",
      "Bosch"
    );

    addDevice(
      'Samsung QLED 55" 4K Smart TV',
      2199,
      4.8,
      47,
      "Телевизоры",
      "Samsung"
    );
    addDevice(
      'Samsung Neo QLED 65" 4K Smart TV',
      3699,
      4.7,
      22,
      "Телевизоры",
      "Samsung"
    );
    addDevice('LG OLED C3 55" 4K Smart TV', 3899, 4.9, 34, "Телевизоры", "LG");
    addDevice(
      'Sony Bravia 55" 4K Google TV',
      3099,
      4.5,
      29,
      "Телевизоры",
      "Sony"
    );
    addDevice(
      'Xiaomi TV A2 50" 4K Android TV',
      1499,
      4.2,
      61,
      "Телевизоры",
      "Xiaomi"
    );

    addDevice(
      "Bosch Serie 6 8 кг 1400 об/мин",
      1699,
      4.8,
      38,
      "Стиральные машины",
      "Bosch"
    );
    addDevice("LG AI DD 8 кг Steam", 1599, 4.6, 27, "Стиральные машины", "LG");
    addDevice(
      "Samsung EcoBubble 7 кг",
      1399,
      4.4,
      33,
      "Стиральные машины",
      "Samsung"
    );
    addDevice(
      "Haier HW80 узкая 8 кг",
      1299,
      4.3,
      21,
      "Стиральные машины",
      "Haier"
    );

    for (let i = 1; i <= 10; i++) {
      addDevice(
        `Xiaomi умный гаджет ${i}`,
        59 + i * 5,
        4.1 + (i % 3) * 0.1,
        12 + i,
        "Смартфоны",
        "Xiaomi"
      );
      addDevice(
        `Samsung аксессуар для ТВ ${i}`,
        49 + i * 4,
        4.0 + (i % 4) * 0.1,
        8 + i,
        "Телевизоры",
        "Samsung"
      );
      addDevice(
        `Apple аксессуар для Mac ${i}`,
        79 + i * 6,
        4.3 + (i % 2) * 0.1,
        5 + i,
        "Ноутбуки",
        "Apple"
      );
    }

    const createdDevices = await Device.bulkCreate(devicesData, {
      ignoreDuplicates: true,
    });
    const typeNames = {};
    (await Type.findAll()).forEach((t) => (typeNames[t.id] = t.name));

    for (const d of createdDevices) {
      const lowerName = d.name.toLowerCase();
      const typeName = typeNames[d.typeId] || "";
      const info = [];

      info.push({
        title: "Описание",
        description: longDescription(d.name, typeName),
        deviceId: d.id,
      });

      let specs = [];
      if (
        lowerName.includes("galaxy") ||
        lowerName.includes("iphone") ||
        lowerName.includes("xiaomi") ||
        lowerName.includes("redmi")
      ) {
        specs = buildPhoneSpecs(d.name);
      } else if (
        lowerName.includes("macbook") ||
        lowerName.includes("pavilion") ||
        lowerName.includes("ideapad") ||
        lowerName.includes("tuf") ||
        lowerName.includes("book4")
      ) {
        specs = buildLaptopSpecs(d.name);
      } else if (
        lowerName.includes("холодильник") ||
        lowerName.includes("serie") ||
        lowerName.includes("haier") ||
        lowerName.includes("rb34") ||
        lowerName.includes("doorcooling")
      ) {
        specs = buildFridgeSpecs();
      } else if (
        lowerName.includes("tv") ||
        lowerName.includes("oled") ||
        lowerName.includes("qled") ||
        lowerName.includes("bravia")
      ) {
        specs = buildTVSpecs(d.name);
      } else if (
        lowerName.includes("стираль") ||
        lowerName.includes("kg") ||
        lowerName.includes("eco") ||
        lowerName.includes("hw80")
      ) {
        specs = buildWasherSpecs(d.name);
      } else {
        specs = [
          { title: "Гарантия", description: "12 месяцев" },
          { title: "Страна производства", description: "Вьетнам / Китай" },
          { title: "Комплектация", description: "Полная" },
          { title: "Класс энергопотребления", description: "A" },
          { title: "Подключение", description: "Bluetooth / Wi‑Fi" },
          { title: "Вес", description: "До 0.5 кг" },
        ];
      }

      specs.forEach((s) => {
        info.push({
          title: s.title,
          description: s.description,
          deviceId: d.id,
        });
      });

      while (info.length < 8) {
        info.push({
          title: "Дополнительно",
          description: "Подробности в инструкции",
          deviceId: d.id,
        });
      }

      await DeviceInfo.bulkCreate(info);
    }

    console.log("Seeding completed");
    process.exit(0);
  } catch (e) {
    console.error("Seeding error:", e);
    process.exit(1);
  }
}

seed();
