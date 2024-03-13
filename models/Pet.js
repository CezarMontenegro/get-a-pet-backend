const mongoose = require('mongoose');
const { Schema } = mongoose;

const Pet = mongoose.model(
  'Pet',
  new Schema(
    {
      name: {
        type: String,
        required: true
      },
      age: {
        type: Number,
        required: true
      },
      wheight: {
        type: Number,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      images: {
        type: Array,
        required: true,
      },
      avaliable: {
        type: boolean 
      },
      user: Object,
      adopter: Object
    },
    { timestamps: true },
  )
);

module.exports = Pet;
