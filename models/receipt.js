class Receipt {
  constructor(id, userId, title, photo, company, date, total, guaranteeDate, category, tags) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.photo = photo;
    this.company = company;
    this.date = date;
    this.total = total;
    this.guaranteeDate = guaranteeDate;
    this.category = category;
    this.tags = tags;
  }
}

export default Receipt;
