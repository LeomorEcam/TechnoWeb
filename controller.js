const Model = require('./model.js');
const db = require('./test');
let express = require("express");
let router = express.Router();
router.use(express.static('.'));    //dossier
var mariadb = require("mariadb");
const connection = mariadb.createPool({
    host: 'localhost', 
    user:'UserDB', 
    password: '1234',
    database:'ITAcademyDB'
});

//let model = new Model();
let session = require('express-session');
router.use(session({
    secret: 'leoSecret',
    resave: false,
    saveUninitialized: true
}));

/** ===============================================> a utiliser avec le test.js
 * db.getAllMonsters().then(data => {console.log(data);});

router.get('/',(request,response)=> {
    db.getAllMonsters().then(data => {console.log(data);});
});**/
router.get('/',(request,response)=>{
    /** ===========================================> le .ejs lié ne recoit rien
     * console.log("get");
    request.session.lessonList = [];
    console.log("hhhhhhhhhhhhhhhhhh");
    console.log(model.getLessonDB("select * from trainingtab;",request.session.lessonList));
    console.log(model.db);

    response.render('index.ejs',{tabMap:model.getLessonDB2("select * from trainingtab;",request.session.lessonList), namePseudo: undefined});
**/
    request.session.lessonList = [];
    connection.getConnection().then(conn => {
        conn.query("select * from trainingtab;")
        .then((rows) => {
            console.log(rows);
            let tabDB=[];
            rows.forEach(element => {
                tabDB.push(element);
            });
            response.render('index.ejs',{tabMap:tabDB, namePseudo: undefined});
        })
        .finally((a) => conn.end());
    });;
});
router.post('/',(request,response)=>{
    console.log("post");
    console.log(request.body);
    console.log(request.session);
    let list = request.session.lessonList;
    let pseudo = request.session.pseudo;
    switch(request.body.button){
        case 'Se connecter':
            response.render('connexion.ejs');
            break;
        case "S'inscrire":
            console.log(request.body);
            
            if(list.find((element) => element == request.body.Id) === undefined){
                request.session.lessonList.push(request.body.Id);
            }

            connection.getConnection().then(conn => {
                if(request.session.pseudo != undefined){
                    conn.query("select * from usertab where pseudo = (?);",[request.session.pseudo])
                    .then((rows) => {
                        if(rows.length == 0){
                            conn.query(" select * from trainingtab;")
                            .then((rows) => {
                                console.log("verif");
                                console.log(rows);
                                let tabDB=[];
                                rows.forEach(element => {
                                    if(list.find((el) => el == element.Id) ===undefined){
                                        tabDB.push(element);
                                    }
                                });
                                response.render('index.ejs',{tabMap:tabDB,namePseudo:pseudo});
                            })
                        }
                        else{
                            conn.query("select * from trainingtab where id not in (select trainingid from usertab u left join trainingtab t on u.trainingid = t.id where pseudo = (?));",[request.session.pseudo])
                            .then((rows) => {
                                console.log("verif");
                                console.log(rows);
                                let tabDB=[];
                                rows.forEach(element => {
                                    if(list.find((el) => el == element.Id) ===undefined){
                                        tabDB.push(element);
                                    }
                                });
                                response.render('index.ejs',{tabMap:tabDB,namePseudo:pseudo});
                            })
                        }
                    })
                    .finally((a) => conn.end());
                }
                else{
                    conn.query("select * from trainingtab;")
                    .then((rows) => {
                        let tabDB=[];
                        rows.forEach(element => {
                            if(list.find((el) => el == element.Id) ===undefined){
                                tabDB.push(element);
                            }
                        });
                        response.render('index.ejs',{tabMap:tabDB,namePseudo:pseudo});
                    })
                    .finally((a) => conn.end());
                }
            });
            break;
        case "Voir le panier":
            connection.getConnection().then(conn => {
                conn.query("select * from trainingtab;")
                .then((rows) => {
                    let tabDB=[];
                    rows.forEach(element => {
                        if(list.find((el) => el == element.Id)!= undefined){
                            tabDB.push(element);
                        }
                    });
                    response.render('basket.ejs',{tabMap:tabDB});
                })
                .finally((a) => conn.end());
            });;
            break;
        case "Supprimer":
            for (let index = 0; index < request.session.lessonList.length; index++) {
                if(request.session.lessonList[index] === request.body.Id){
                    request.session.lessonList.splice(index, 1);;
                    break;
                }
            }
            connection.getConnection().then(conn => {
                conn.query("select * from trainingtab;")
                .then((rows) => {
                    let tabDB=[];
                    rows.forEach(element => {
                        if(list.find((el) => el == element.Id)!= undefined){
                            tabDB.push(element);
                        }
                    });
                    response.render('basket.ejs',{tabMap:tabDB});
                })
                .finally((a) => conn.end());
            });;
            break;
        case "Finaliser l'inscription":
            if(request.session.pseudo != undefined){
                request.session.lessonList.forEach(element => {
                    connection.getConnection().then(conn => {
                        conn.query("insert into Usertab(Pseudo, TrainingId) values(?,?)", [request.session.pseudo,element])
                        .then((rows) => {
                            request.session.lessonList = [];
                        })
                        .finally((a) => conn.end());
                    });;
                });
                response.render('finish.ejs');
                
            }
            break;
        case "Retourner au catalogue de formation":
            connection.getConnection().then(conn => {
                if(request.session.pseudo != undefined){
                    conn.query("select * from usertab where pseudo = (?);",[request.session.pseudo])
                    .then((rows) => {
                        if(rows.length == 0){
                            conn.query(" select * from trainingtab;")
                            .then((rows) => {
                                console.log("verif");
                                console.log(rows);
                                let tabDB=[];
                                rows.forEach(element => {
                                    if(list.find((el) => el == element.Id) ===undefined){
                                        tabDB.push(element);
                                    }
                                });
                                response.render('index.ejs',{tabMap:tabDB,namePseudo:pseudo});
                            })
                        }
                        else{
                            conn.query("select * from trainingtab where id not in (select trainingid from usertab u left join trainingtab t on u.trainingid = t.id where pseudo = (?));",[request.session.pseudo])
                            .then((rows) => {
                                console.log("verif");
                                console.log(rows);
                                let tabDB=[];
                                rows.forEach(element => {
                                    if(list.find((el) => el == element.Id) ===undefined){
                                        tabDB.push(element);
                                    }
                                });
                                response.render('index.ejs',{tabMap:tabDB,namePseudo:pseudo});
                            })
                        }
                    })
                    .finally((a) => conn.end());
                }
                else{
                    conn.query("select * from trainingtab;")
                    .then((rows) => {
                        let tabDB=[];
                        rows.forEach(element => {
                            if(list.find((el) => el == element.Id) ===undefined){
                                tabDB.push(element);
                            }
                        });
                        response.render('index.ejs',{tabMap:tabDB,namePseudo:pseudo});
                    })
                    .finally((a) => conn.end());
                }
            });
            break;
        case 'Enregistrer':
            request.session.pseudo = request.body.pseudo;
        default:
            connection.getConnection().then(conn => {
                if(request.session.pseudo != undefined){
                    conn.query("select * from usertab where pseudo = (?);",[request.session.pseudo])
                    .then((rows) => {
                        if(rows.length == 0){
                            conn.query(" select * from trainingtab;")
                            .then((rows) => {
                                console.log("verif");
                                console.log(rows);
                                let tabDB=[];
                                rows.forEach(element => {
                                    if(list.find((el) => el == element.Id) ===undefined){
                                        tabDB.push(element);
                                    }
                                });
                                response.render('index.ejs',{tabMap:tabDB,namePseudo:pseudo});
                            })
                        }
                        else{
                            conn.query("select * from trainingtab where id not in (select trainingid from usertab u left join trainingtab t on u.trainingid = t.id where pseudo = (?));",[request.session.pseudo])
                            .then((rows) => {
                                console.log("verif");
                                console.log(rows);
                                let tabDB=[];
                                rows.forEach(element => {
                                    if(list.find((el) => el == element.Id) ===undefined){
                                        tabDB.push(element);
                                    }
                                });
                                response.render('index.ejs',{tabMap:tabDB,namePseudo:pseudo});
                            })
                        }
                    })
                    .finally((a) => conn.end());
                }
                else{
                    conn.query("select * from trainingtab;")
                    .then((rows) => {
                        let tabDB=[];
                        rows.forEach(element => {
                            if(list.find((el) => el == element.Id) ===undefined){
                                tabDB.push(element);
                            }
                        });
                        response.render('index.ejs',{tabMap:tabDB,namePseudo:pseudo});
                    })
                    .finally((a) => conn.end());
                }
            });
    }
});

module.exports = router;