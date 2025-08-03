const { ObjectId } = require('mongodb');
const { getDB } = require('../utils/databaseutil');

module.exports = class Clothes {
  constructor(itemName, category, subcategory, size, condition, brand, color, price, points, mainImageUrl, description, tags, userId) {
    this.itemName = itemName;
    this.category = category;
    this.subcategory = subcategory;
    this.size = size;
    this.condition = condition;
    this.brand = brand;
    this.color = color;
    this.price = parseFloat(price);
    this.points = parseInt(points) || 0;
    this.mainImageUrl = mainImageUrl;
    this.description = description;
    this.tags = tags ? tags.split(',').map(tag => tag.trim()) : [];
    this.userId = userId;
    this.status = 'active'; // active, sold, pending, suspended
    this.views = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
  
  save() {
    const db = getDB();
    const clothesData = {
      itemName: this.itemName,
      category: this.category,
      subcategory: this.subcategory,
      size: this.size,
      condition: this.condition,
      brand: this.brand,
      color: this.color,
      price: this.price,
      points: this.points,
      mainImageUrl: this.mainImageUrl,
      description: this.description,
      tags: this.tags,
      userId: this.userId,
      status: this.status,
      views: this.views,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    if (this._id) {
      // Update existing clothes
      return db.collection('clothes').updateOne(
        { _id: new ObjectId(this._id) },
        { 
          $set: {
            ...clothesData,
            updatedAt: new Date()
          }
        }
      );
    } else {
      // Insert new clothes
      return db.collection('clothes').insertOne(clothesData);
    }
  }

  static fetchAll() {
    const db = getDB();
    return db.collection('clothes').find().toArray();
  }

  static findById(clothesId) {
    const db = getDB();
    return db.collection('clothes').find({ _id: new ObjectId(String(clothesId)) }).next();
  }

  static findByUserId(userId) {
    const db = getDB();
    return db.collection('clothes').find({ userId: userId }).toArray();
  }

  static findByCategory(category) {
    const db = getDB();
    return db.collection('clothes').find({ category: category, status: 'active' }).toArray();
  }

  static findByStatus(status) {
    const db = getDB();
    return db.collection('clothes').find({ status: status }).toArray();
  }

  static findActive() {
    const db = getDB();
    return db.collection('clothes').find({ status: 'active' }).toArray();
  }

  static updateStatus(clothesId, status) {
    const db = getDB();
    return db.collection('clothes').updateOne(
      { _id: new ObjectId(String(clothesId)) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        }
      }
    );
  }

  static incrementViews(clothesId) {
    const db = getDB();
    return db.collection('clothes').updateOne(
      { _id: new ObjectId(String(clothesId)) },
      { $inc: { views: 1 } }
    );
  }

  static deleteById(clothesId) {
    const db = getDB();
    return db.collection('clothes').deleteOne({ _id: new ObjectId(String(clothesId)) });
  }

  static searchByTags(tags) {
    const db = getDB();
    const tagArray = Array.isArray(tags) ? tags : [tags];
    return db.collection('clothes').find({ 
      tags: { $in: tagArray },
      status: 'active'
    }).toArray();
  }

  static getStats() {
    const db = getDB();
    return db.collection('clothes').aggregate([
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalActive: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          totalSold: { $sum: { $cond: [{ $eq: ["$status", "sold"] }, 1, 0] } },
          totalViews: { $sum: "$views" },
          avgPrice: { $avg: "$price" }
        }
      }
    ]).toArray();
  }
};