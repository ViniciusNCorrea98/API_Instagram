const express = require('express');
const cors = require('cors');
const rotas = require('./rotas');

const app = express();

app.use(express.json());
app.use(cors());
app.use(rotas);

app.listen(8000);