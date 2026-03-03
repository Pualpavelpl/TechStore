import { makeAutoObservable } from "mobx";

export default class DeviceStore {
  constructor() {
    this._types = [];
    this._brands = [];
    this._devices = [];
    this._selectedType = {};
    this._selectedBrand = {};
    this._page = 1;
    this._totalCount = 0;
    this._limit = 3;
    this._minPrice = 0;
    this._maxPrice = 0;
    this._minRating = 0;
    this._onlyNew = false;
    makeAutoObservable(this);
  }

  setTypes(types) {
    this._types = types;
  }
  setBrands(brands) {
    this._brands = brands;
  }
  setDevices(devices) {
    this._devices = devices;
    if (devices.length > 0) {
      this._maxPrice = Math.max(...devices.map((d) => Number(d.price) || 0));
    }
  }

  setMinPrice(v) {
    this._minPrice = v;
  }
  setMaxPrice(v) {
    this._maxPrice = v;
  }
  setMinRating(v) {
    this._minRating = v;
  }
  setOnlyNew(v) {
    this._onlyNew = v;
  }
  resetFilters() {
    this._minPrice = 0;
    this._maxPrice = this._devices.length
      ? Math.max(...this._devices.map((d) => Number(d.price) || 0))
      : 0;
    this._minRating = 0;
    this._onlyNew = false;
  }

  setSelectedType(type) {
    this.setPage(1);
    this._selectedType = type;
  }
  setSelectedBrand(brand) {
    this.setPage(1);
    this._selectedBrand = brand;
  }
  setPage(page) {
    this._page = page;
  }
  setTotalCount(count) {
    this._totalCount = count;
  }

  get types() {
    return this._types;
  }
  get brands() {
    return this._brands;
  }
  get devices() {
    return this._devices;
  }
  get selectedType() {
    return this._selectedType;
  }
  get selectedBrand() {
    return this._selectedBrand;
  }
  get totalCount() {
    return this._totalCount;
  }
  get page() {
    return this._page;
  }
  get limit() {
    return this._limit;
  }
  get minPrice() {
    return this._minPrice;
  }
  get maxPrice() {
    return this._maxPrice;
  }
  get minRating() {
    return this._minRating;
  }
  get onlyNew() {
    return this._onlyNew;
  }
  get filteredDevices() {
    let list = [...this._devices];
    if (this._minPrice > 0) {
      list = list.filter((d) => (Number(d.price) || 0) >= this._minPrice);
    }
    if (this._maxPrice > 0) {
      list = list.filter((d) => (Number(d.price) || 0) <= this._maxPrice);
    }
    if (this._minRating > 0) {
      list = list.filter((d) => (Number(d.rating) || 0) >= this._minRating);
    }
    if (this._onlyNew) {
      const maxId = Math.max(...this._devices.map((d) => d.id || 0), 0);
      list = list.filter((d) => (d.id || 0) >= maxId - 10);
    }
    return list;
  }
}
