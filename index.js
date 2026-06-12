const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

require('dotenv').config();
require('./conn');

app.use(express.json());
// app.use(cors({
//     credentials: true,
//     origin: 'http://localhost:5173'
// }));

app.use(cors());

const UserRoutes = require('./Routes/user');
const ResumeRoutes = require('./Routes/resume');

app.use('/api/user', UserRoutes);
app.use('/api/resume', ResumeRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`
    );
});
