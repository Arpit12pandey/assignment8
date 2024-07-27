const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const app = express();
const API_KEY = 'your_openweathermap_api_key';

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route to upload a file
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    res.send('File uploaded successfully');
  } catch (err) {
    res.status(400).send('Error uploading file');
  }
});

// Route to fetch weather data
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;

  try {
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).send('Error fetching weather data');
  }
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
