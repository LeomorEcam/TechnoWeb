class Model{
    #mariadb;
    #connection;

    /**
     * Constructor of Model, initialise DB connection.
     */
    constructor(){
        this.#mariadb = require("mariadb");
        this.#connection = this.#mariadb.createPool({
            host: 'localhost', 
            user:'UserDB', 
            password: '1234',
            database:'ITAcademyDB'
        });
    }

    /**
     * Private method, does a select request query and return the result.
     * @param {String} dbRequest the query to send.
     * @param {String} pseudo the pseudo of person connected, if he's not already connected, can be undefined.
     * @returns the answer of the query.
     */
    async #selectQueryDB(dbRequest, pseudo=undefined){
        let conn = await this.#connection.getConnection();
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
    /**
     * Take a String request, the list of lesson's id ad return a tab of differents lessons to print.
     * Controller'll use that to do the render
     * @param {String} dbRequest the query to send.
     * @param {boolean} shearchNotHere used if we have to find element on request with list (false) or if we have to fin element on request not in list (true).
     * @param {String} pseudo the pseudo of person connected, if he's not already connected, can be undefined.
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
     * Find if pseudo is already on DB
     * @param {String} dbRequest the query to send.
     * @param {String} pseudo the pseudo of person connected.
     * @returns a boolean if is it on DB or not.
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
     * Does a insert request query for a pseudo's lesson.
     * @param {String} dbRequest the query to send.
     * @param {String} pseudo the pseudo of person connected.
     * @param {Int16} id the id of lesson.
     */
    async insertIntoDB(dbRequest, pseudo, id){
        let conn = await this.#connection.getConnection();
        conn.query(dbRequest, [pseudo,id]);
        conn.end();
    }
};
module.exports = {Model};
//module.exports = Model;