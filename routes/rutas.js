const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./nosotros_api.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
  }
});

// List
router.get('/', (req, res) => {
  db.all('SELECT * FROM kanba', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ kanba: rows });
  });
});


// LIST :id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.all('SELECT * FROM kanba WHERE id = ?', [id], (err, rows) => {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }

    // console.log(rows.length);

    if(rows.length > 0){
     
      res.status(200).json({ kanba: rows });
      
    }else{
      res.status(400).json({kanba : 'No encontrado'});
    }
  });
});


// Insert
router.post('/', (req, res) => {
  const { title } = req.body;
  db.run('INSERT INTO kanba (stage, title) VALUES (1, ?)', [title], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
});


// UPDATE :id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, stage } = req.body;

  if(stage == 1 || stage == 2 || stage == 3){
    db.run('UPDATE kanba SET title = ?, stage = ? WHERE id = ?', [title, stage, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Tablero no encontrado' });
      } else {
        const response = {
          actualizado : true,
          kanba : {id : id,  title : title, stage : stage} 
        }
        res.json(response);
      }
    });


  }else{
    res.status(500).json({ error: 'Estado no valido' });
  }



});

module.exports = router;
