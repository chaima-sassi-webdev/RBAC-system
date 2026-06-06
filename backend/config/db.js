const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("Mongodb database connect ....");
}).catch((err) => {
    console.log(err);
});

module.exports = mongoose;