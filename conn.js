const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://ramprasann503:Ramnagsar232325@cluster0.bngu7bi.mongodb.net/AiResume').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
