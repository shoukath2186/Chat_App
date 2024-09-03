const mongoose = require('mongoose');


const connection = async () => {
    try {
       
        const con = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected successfully!${con.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

module.exports = connection;
