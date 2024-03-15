const mongoose = require('mongoose');

const DBConnection = async (url) => mongoose.connect(url);

module.exports = DBConnection;
