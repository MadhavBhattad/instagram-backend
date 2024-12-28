const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const passport = require('./services/googleOAuth');

const app = express();
connectDB();

app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
