const express = require("express");
const mysql = require("mysql");
const fs = require("fs");
const initialScript = fs.readFileSync("./utils/initial-db-script.sql", "utf-8");

const app = express();

const connection = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'node',
});

connection.query(initialScript);

app.get('/', (req, res) => {
  connection.query(`INSERT INTO people(name) VALUES ('Eduardo Dorneles')`, (err, result) => {
    if (err) {
      res.status(500).send("Erro ao inserir dados no banco de dados.");
      return;
    }

    connection.query(`SELECT * FROM people`, (err, rows) => {
      if (err) {
        res.status(500).send("Erro ao selecionar dados do banco de dados.");
        return;
      }

      const greetingsAndPeopleHtml = `
        <html>
          <body>
            <h1>Full Cycle Rocks!</h1>

            <ul>
              ${rows.map(row => `<li>${row.name}</li>`).join('')}
            </ul>
          </body>
        </html>
      `;

      res.send(greetingsAndPeopleHtml);
    });
  });
});


app.listen(3000, () => {
  console.log('Rodando na porta 3000');
});
