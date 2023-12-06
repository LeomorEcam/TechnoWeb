const Model = require('./model.js');
let express = require("express");
let router = express.Router();
router.use(express.static('.'));    //dossier
let model = new Model.Model();
let session = require('express-session');

router.use(session({
    secret: 'leoSecret',
    resave: false,
    saveUninitialized: true
}));

router.get('/',async function(request,response){
    request.session.lessonList = [];
    request.session.finalSubscribe = false;
    let tab = await model.getLessonDB("select * from trainingtab;",request.session.lessonList);
    response.render('index.ejs',{tabMap:tab, namePseudo: undefined});
});

router.post('/',async function(request,response){
    console.log("post");
    console.log(request.body);
    console.log(request.session);
    let list = request.session.lessonList;
    let pseudo = request.session.pseudo;
    let rows = [];
    let rowsSomeone = [];
    switch(request.body.button){
        case 'Se connecter':
            response.render('connexion.ejs',{finishStep: request.session.finalSubscribe});
            break;
        case "S'inscrire":
            console.log(request.body);
            
            if(list.find((element) => element == request.body.Id) === undefined){
                request.session.lessonList.push(request.body.Id);
            }
            if(request.session.pseudo != undefined){
                rowsSomeone = await model.isSomeoneInDB("select * from usertab where pseudo = (?);", request.session.pseudo);
                if(rowsSomeone.length == 0){
                    let rows = await model.getLessonDB("select * from trainingtab;",request.session.lessonList);
                    response.render('index.ejs',{tabMap:rows,namePseudo:pseudo});
                }
                else{
                    rows = await model.getLessonDB("select * from trainingtab where id not in (select trainingid from usertab u left join trainingtab t on u.trainingid = t.id where pseudo = (?));",request.session.lessonList,request.session.pseudo);
                    response.render('index.ejs',{tabMap:rows,namePseudo:pseudo});
                }
            }
            else{
                rows = await model.getLessonDB("select * from trainingtab;",request.session.lessonList);
                response.render('index.ejs',{tabMap:rows,namePseudo:pseudo});
            }
            break;
        case "Voir le panier":
            rows = await model.getLessonDB("select * from trainingtab;",[]);
            let tabDB = [];
            console.log(request.session.lessonList);
            console.log(rows);
            rows.forEach(element => {
                if(request.session.lessonList.find((el) => el == element.Id)!= undefined){
                    tabDB.push(element);
                }
            });
            console.log(tabDB);
            response.render('basket.ejs',{tabMap:tabDB});
            break;
        case "Supprimer":
            for (let index = 0; index < request.session.lessonList.length; index++) {
                if(request.session.lessonList[index] === request.body.Id){
                    request.session.lessonList.splice(index, 1);;
                    break;
                }
            }
            rows = await model.getLessonDB("select * from trainingtab;",request.session.lessonList,undefined,true);
            response.render('basket.ejs',{tabMap:rows});
            break;
        case "Finaliser l'inscription":
            if(request.session.pseudo != undefined){
                for (let i = 0; i<request.session.lessonList.length;i++){
                    await model.insertIntoDB("insert into Usertab(Pseudo, TrainingId) values(?,?);", request.session.pseudo,request.session.lessonList[i]);
                }
                request.session.lessonList = [];
                response.render('finish.ejs');
            }
            else{
                request.session.finalSubscribe = true;
                response.render('connexion.ejs',{finishStep: request.session.finalSubscribe});
            }
            break;
        case "Enregistrer et finaliser l'inscription":
            request.session.pseudo = request.body.pseudo;
            for (let i = 0; i<request.session.lessonList.length;i++){
                await model.insertIntoDB("insert into Usertab(Pseudo, TrainingId) values(?,?);", request.session.pseudo,request.session.lessonList[i]);
            }
            request.session.lessonList = [];
            response.render('finish.ejs');

            break;
        case "Retourner au catalogue de formation":
            if(request.session.pseudo != undefined){
                rowsSome = await model.isSomeoneInDB("select * from usertab where pseudo = (?);",request.session.pseudo);
                if(rowsSome.length == 0){
                    rows = await model.getLessonDB("select * from trainingtab;",request.session.lessonList,undefined,true);
                    response.render('index.ejs',{tabMap:rows,namePseudo:pseudo});
                }
                else{
                    rows = await model.getLessonDB("select * from trainingtab where id not in (select trainingid from usertab u left join trainingtab t on u.trainingid = t.id where pseudo = (?));",request.session.lessonList,request.session.pseudo);
                    response.render('index.ejs',{tabMap:rows,namePseudo:pseudo});
                }
            }
            else{
                rows = await model.getLessonDB("select * from trainingtab;",request.session.lessonList);
                response.render('index.ejs',{tabMap:rows,namePseudo:pseudo});
            }
            break;
        case 'Enregistrer':
            request.session.pseudo = request.body.pseudo;
            
        default:
            if(request.session.pseudo != undefined){
                rowsSome = await model.isSomeoneInDB("select * from usertab where pseudo = (?);",request.session.pseudo);
                if(rowsSome.length == 0){
                    rows = await model.getLessonDB("select * from trainingtab;",request.session.lessonList);
                    response.render('index.ejs',{tabMap:rows,namePseudo:pseudo});
                }
                else{
                    rows = await model.getLessonDB("select * from trainingtab where id not in (select trainingid from usertab u left join trainingtab t on u.trainingid = t.id where pseudo = (?));",request.session.lessonList,request.session.pseudo);
                    response.render('index.ejs',{tabMap:rows,namePseudo:pseudo});
                }
            }
            else{
                rows = await model.getLessonDB("select * from trainingtab;",request.session.lessonList);
                response.render('index.ejs',{tabMap:tabDB,namePseudo:pseudo});
            }
    }
});

module.exports = router;