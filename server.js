const express = require('express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const fs = require('fs');


const app = express();
const csrfProtection = csrf({ cookie: true });

app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); 


app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


app.get('/', (req, res) => {
  const stream = fs.createReadStream("index.html");
  stream.pipe(res);
});

// POST-rutt för att hantera formulärinlämning
app.post('/submit', csrfProtection, (req, res) => {
  const receivedData = req.body.data;
  res.send(`Data mottaget: ${receivedData}`);
});

// Felhantering för CSRF
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).send('Fel: Ogiltig CSRF-token');
  } else {
    next(err);
  }
});

// Starta servern
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
