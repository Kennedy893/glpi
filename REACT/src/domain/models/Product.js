export class Product {
  constructor(id, name, price, imageUrl) {
    this.id = id;
    this.name = name;
    this.price = parseFloat(price);
    this.imageUrl = imageUrl;
  }

  getFormattedPrice() {
    return `${this.price.toFixed(2)} €`;
  }
}