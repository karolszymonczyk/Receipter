class Receipt {
  constructor(id, photo, userId, category, shop, reclamationDate, date, total) {
    this.id = id;
    this.photo = photo;
    this.userId = userId;
    this.category = category;
    this.shop = shop;
    this.reclamationDate = reclamationDate;
    this.date = date;
    this.total = total;
  }
}

export default Receipt;
