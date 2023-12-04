const mariadb = require("mariadb");
const pool = mariadb.createPool({
    connectionLimit: 10,
    host: 'localhost', 
    user:'UserDB', 
    password: '1234',
    database:'ITAcademyDB'
});

// by default limit it to 100 results
function getAllMonsters() {
    return new Promise((resolve, reject) => {
        const sql = "select * from trainingtab;";
        console.log(sql);
        pool.query(sql, function (err, results, fields) {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}
module.exports = {getAllMonsters};