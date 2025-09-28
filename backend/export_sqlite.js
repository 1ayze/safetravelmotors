const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const outputPath = path.join(__dirname, 'migration.sql');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

let sqlOutput = '';

db.serialize(() => {
  // Get all table names
  db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'", (err, tables) => {
    if (err) {
      console.error('Error getting tables:', err.message);
      return;
    }

    let tablesProcessed = 0;

    tables.forEach((table) => {
      const tableName = table.name;

      // Get CREATE TABLE statement
      db.get(`SELECT sql FROM sqlite_master WHERE type='table' AND name='${tableName}'`, (err, row) => {
        if (err) {
          console.error(`Error getting schema for ${tableName}:`, err.message);
          return;
        }

        let createSql = row.sql;

        // Convert SQLite syntax to MySQL
        createSql = createSql.replace(/AUTOINCREMENT/g, 'AUTO_INCREMENT');
        createSql = createSql.replace(/INTEGER PRIMARY KEY/g, 'INT AUTO_INCREMENT PRIMARY KEY');
        createSql = createSql.replace(/REAL/g, 'FLOAT');
        createSql = createSql.replace(/TEXT/g, 'VARCHAR(255)');

        sqlOutput += createSql + ';\n\n';

        // Get data
        db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
          if (err) {
            console.error(`Error getting data for ${tableName}:`, err.message);
            return;
          }

          if (rows.length > 0) {
            const columns = Object.keys(rows[0]);
            const insertSql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES\n`;

            const values = rows.map(row => {
              const vals = columns.map(col => {
                const val = row[col];
                if (val === null) return 'NULL';
                if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                if (typeof val === 'boolean') return val ? '1' : '0';
                return val;
              });
              return `(${vals.join(', ')})`;
            });

            sqlOutput += insertSql + values.join(',\n') + ';\n\n';
          }

          tablesProcessed++;
          if (tablesProcessed === tables.length) {
            // Write to file
            fs.writeFileSync(outputPath, sqlOutput);
            console.log(`Migration SQL exported to ${outputPath}`);
            db.close();
          }
        });
      });
    });
  });
});
