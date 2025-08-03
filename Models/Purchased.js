const { ObjectId } = require('mongodb');
const { getDB } = require('../utils/databaseutil');

module.exports = class Purchase {
  constructor(itemId, buyerEmail, sellerEmail, price, points, status = 'completed', itemName, itemImageUrl, itemCategory) {
    this.itemId = itemId;
    this.buyerEmail = buyerEmail;
    this.sellerEmail = sellerEmail;
    this.price = price;
    this.points = points;
    this.status = status;
    this.purchasedAt = new Date();
    this.itemName = itemName;           // Add this
    this.itemImageUrl = itemImageUrl;   // Add this
    this.itemCategory = itemCategory;   // Add this
  }

  save() {
    const db = getDB();
    const purchaseData = {
      itemId: this.itemId,
      buyerEmail: this.buyerEmail,
      sellerEmail: this.sellerEmail,
      price: this.price,
      points: this.points,
      status: this.status,
      purchasedAt: this.purchasedAt,
      itemName: this.itemName,           // Add this
      itemImageUrl: this.itemImageUrl,   // Add this
      itemCategory: this.itemCategory    // Add this
    };
    return db.collection('purchases').insertOne(purchaseData);
  }

  static fetchAll() {
    const db = getDB();
    return db.collection('purchases').find().toArray();
  }

  static findByBuyer(buyerEmail) {
    const db = getDB();
    return db.collection('purchases').find({ buyerEmail }).toArray();
  }

  static findBySeller(sellerEmail) {
    const db = getDB();
    return db.collection('purchases').find({ sellerEmail }).toArray();
  }

  static findByItem(itemId) {
    const db = getDB();
    return db.collection('purchases').find({ itemId: itemId }).toArray();
  }
};
