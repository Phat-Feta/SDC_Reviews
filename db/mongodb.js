const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/sdc_reviews')

const reviewSchema = new mongoose.Schema({
  review_id: Number,
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: Date,
  reviewer_name: String,
  email: String,
  helpfulness: Number,
  photos: [
    {
      id: Number,
      url: String
    }
  ]
});

const characteristicSchema = new mongoose.Schema({
  id: Number,
  value: Number
});

const metaSchema = new mongoose.Schema({
  product_id: Number,
  ratings: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number
  },
  recommended: {
    false: Number,
    true: Number
  },
  characteristics: {
    Size: characteristicSchema,
    Length: characteristicSchema,
    Width: characteristicSchema,
    Fit: characteristicSchema,
    Comfort: characteristicSchema,
    Quality: characteristicSchema
  }
})

const dbReviews = mongoose.model('reviews', reviewSchema);
const dbMeta = mongoose.model('meta', metaSchema);

module.exports = { dbReviews, dbMeta }