const mariadb = require("mariadb");
const connecte = mariadb.createPool({
    host: 'localhost', 
    user:'UserDB', 
    password: '1234',
    database:'ITAcademyDB'
});

function getLessonDB2(dbRequest,list, pseudo=undefined){
    //connecte.connect();
    return new Promise((resolve, reject) => {
        // This question mark syntax will be explained below.
        const sql = "select * from trainingtab;";
        
        connecte.query(sql,function (err, results, fields) {
            if (err) {
                return reject(err);
            }
            console.log(results);
            return resolve(results);
        });
    });
};
class Model{

    constructor(){
        this.mariadb = require("mariadb");
        this.connection = this.mariadb.createPool({
            host: 'localhost', 
            user:'UserDB', 
            password: '1234',
            database:'ITAcademyDB'
        });
        this.db = [];
    }

    getLessonDB2(dbRequest,list, pseudo=undefined){
        //connecte.connect();
        return new Promise((resolve, reject) => {
            // This question mark syntax will be explained below.
            const sql = "select * from trainingtab;";
            
            connecte.query(sql,function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                console.log(results);
                return resolve(results);
            });
        });
        /**let conn = await this.connection.getConnection();
        let tabDB=[];
        try {
            if(pseudo != undefined){
                const rows = await conn.query(dbRequest,[pseudo]);
                console.log(rows);
                
                rows.forEach(element => {
                    if(list.find((el) => el == element.Id) ===undefined){
                        tabDB.push(element);
                    }
                });
                return tabDB;
            }
            else{
                const rows = await conn.query(dbRequest);
                console.log(rows);
                //let tabDB=[];
                rows.forEach(element => {
                    if(list.find((el) => el == element.Id) ===undefined){
                        //tabDB.push(element);
                        tabDB.push({"Id":element.Id,
                                    "Name":element.Name,
                                    "Price":element.Price,
                                    "Begin":element.Begin,
                                    "End":element.End});
                        this.db.push({"Id":element.Id,
                        "Name":element.Name,
                        "Price":element.Price,
                        "Begin":element.Begin,
                        "End":element.End});
                    }
                });
                console.log(tabDB);
                return tabDB;
            }
        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end();
        }**/
      }

    /**
     * prend un string de la requete et le pseudo et retourne un tableau des différents lessons
     * le controlleur utilisera pour faire le render
     * @param {String} dbRequest 
     * @param {String} pseudo 
     */
    getLessonDB(dbRequest,list, pseudo=undefined){
        let tabDB=[];
        this.connection.getConnection().then(conn => {
            if(pseudo != undefined){
                conn.query(dbRequest,[pseudo])
                .then((rows) => {
                    console.log("verif");
                    console.log(rows);
                    let tabDB=[];
                    rows.forEach(element => {
                        if(list.find((el) => el == element.Id) ===undefined){
                            tabDB.push(element);
                        }
                    });
                    return tabDB;
                })
            }
            else{
                conn.query(dbRequest)
                .then((rows) => {
                    //let tabDB=[];
                    rows.forEach(element => {
                        if(list.find((el) => el == element.Id) ===undefined){
                            tabDB.push({"Id":element.Id,
                            "Name":element.Name,
                            "Price":element.Price,
                            "Begin":element.Begin,
                            "End":element.End});
                        }
                    });
                    
                    //console.log(tabDB);
                    //return tabDB;
                })
                .finally((a) => {
                    conn.end();
                    console.log("zzzzzzzzzzzzzzz");
                    console.log(tabDB);
                    
                    return tabDB;
                });
            }
        });
    };
    /**
     * 
     * @param {String} dbRequest 
     * @param {String} pseudo 
     */
    isSomeoneInDB(dbRequest, pseudo){
        this.connection.getConnection().then(conn => {
            conn.query("select * from usertab where pseudo = (?);",[request.session.pseudo])
            .then((rows) => {
                if(rows.length == 0){
                    return false;
                }
                else{
                    return true;
                }
            }).finally((a)=> {
                conn.end();
            });
        });
    };

    /**
     * 
     * @param {String} dbRequest 
     * @param {String} pseudo 
     * @param {Int16} id 
     */
    insertIntoDB(dbRequest, pseudo, id){
        connection.getConnection().then(conn => {
            conn.query(dbRequest, [pseudo,id])
            .then((rows) => {
            })
            .finally((a) => conn.end());
        });;
    }
};
module.exports = {getLessonDB2,Model};
//module.exports = Model;