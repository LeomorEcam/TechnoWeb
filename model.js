const mariadb = require("mariadb");
const connecte = mariadb.createPool({
    host: 'localhost', 
    user:'UserDB', 
    password: '1234',
    database:'ITAcademyDB'
});

//creer 2 fonction, et mettre des fonctions génériques 

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

    async #selectQueryDB(dbRequest, pseudo=undefined){
        let conn = await this.connection.getConnection();
        if(pseudo != undefined){
            const rows = conn.query(dbRequest,[pseudo]);
            conn.end();
            return rows;
        }
        else{
            const rows = conn.query(dbRequest);
            conn.end();
            return rows;
        }
    }
    async getLessonDB3(pseudo=undefined){
        let conn = await this.connection.getConnection();
            const sql = "select * from trainingtab;";
            const tab = conn.query(sql);
            conn.end();
            return tab;
    };
    /**
     * prend un string de la requete et le pseudo et retourne un tableau des différents lessons
     * le controlleur utilisera pour faire le render
     * @param {String} dbRequest 
     * @param {boolean} shearchNotHere
     * @param {String} pseudo 
     */
    async getLessonDB(dbRequest,list, pseudo=undefined, shearchNotHere=false){

        const rows= await this.#selectQueryDB(dbRequest,pseudo);
        let tabDB = [];
        rows.forEach(element => {
            if(!shearchNotHere && list.find((el) => el == element.Id) ===undefined){
                tabDB.push(element);
            }
            else if(shearchNotHere && list.find((el) => el == element.Id) !=undefined){
                tabDB.push(element);
            }
        });
        return tabDB;
    };
    /**
     * 
     * @param {String} dbRequest 
     * @param {String} pseudo 
     */
    async isSomeoneInDB(dbRequest, pseudo){
        const rows = this.#selectQueryDB(dbRequest,pseudo);
        if(rows.length == 0){
            return false;
        }
        else{
            return true;
        }
    };

    /**
     * 
     * @param {String} dbRequest 
     * @param {String} pseudo 
     * @param {Int16} id 
     */
    async insertIntoDB(dbRequest, pseudo, id){
        let conn = await this.connection.getConnection();
        const done = conn.query(dbRequest, [pseudo,id]);
        conn.end();
    }
};
module.exports = {getLessonDB2,Model};
//module.exports = Model;