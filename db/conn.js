const mongoose = require('mongoose');

async function main() {
  await mongoose.conncect('mongodb://localhost:27017/getapet');

  console.log("conectou ao mongoose");
}

main().catch((err) => console.log(err));

module.exports = mongoose;