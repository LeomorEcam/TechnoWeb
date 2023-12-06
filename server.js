let express = require("express");
let app = express();
app.use(express.urlencoded({extended: true}));

let routes = require("./controller");
app.use('/',routes);

app.listen(3000, function(){
    console.log('server running');
});



