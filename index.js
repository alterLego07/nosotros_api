const express = require('express');
const app = express();


app.use(express.json());

const usersRouter = require('./routes/rutas.js');


app.use('/boards', usersRouter);



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
