let express = require('express');
let app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://localhost:27017";
let port = process.env.port || 3000;
let collection;

app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        depreclubionErrors: true,
    }
});


async function runDBConnection() {
    try {
        await client.connect();
        collection = client.db().collection('club');
        console.log(collection);
    } catch(ex) {
        console.error(ex);
    }
}

app.get('/', function (req,res) {
    res.render('index.html');
});

app.get('/api/clubs', (req,res) => {
    getAllclub((err,result)=>{
        if (!err) {
            res.json({statusCode:200, data:result, message:'get all clubs successful'});
        }
    });
});

app.post('/api/club', (req,res)=>{
    let club = req.body;
    postclub(club, (err, result) => {
        if (!err) {
            res.json({statusCode:201, data:result, message:'success'});
        }
    });
});

function postclub(club,callback) {
    collection.insertOne(club,callback);
}

function getAllclub(callback){
    collection.find({}).toArray(callback);
}

app.listen(port, ()=>{
    console.log('express server started');
    runDBConnection();
});