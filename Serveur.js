const express = require('express');
const fs = require("fs");
const app = express();

// Ajouter la librairie socket.io
const server = require('http').createServer(app);
const io = require('./mes_modules/chat_socket').listen(server);

const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient; // le pilote MongoDB
const ObjectID = require('mongodb').ObjectID;
const cookieParser = require('cookie-parser');
const i18n = require('i18n');
i18n.configure({
    locales: ['fr', 'en'],
    cookie: 'langueChoisie',
    directory: __dirname + '/locales'
});


const peupler = require('./mes_modules/peupler'); //./mes_modules/peupler/index.js

const util = require("util");
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(i18n.init);

app.set('view engine', 'ejs'); // générateur de template


app.get('/vider', function (req, res) {

    db.collection('adresse').remove({}, (err, resultat) => {
        if (err) return console.log(err)
        res.redirect('/membres');
    });

})


app.get('/peuplement', function (req, res) {
    let aoNouvAdd = peupler();

    let iLongueur = aoNouvAdd.length;
    for (let i = 0; i < iLongueur; i++) {
        db.collection('adresse').save(aoNouvAdd[i], (err, result) => {
            if (err) return console.log(err)

        })
    }

    res.redirect('/membres');
})







app.get('/formulaire', function (req, res) {
    res.render('formulaire.ejs');

})

app.get('/membres', (req, res) => {
    let cursor = db.collection('adresse').find().toArray(function (err, resultat) {
        if (err) return console.log(err)

        res.render('membres.ejs', {
            membres: resultat
        })
    })
})


app.get('/', (req, res) => {
    res.render('accueil.ejs');
})


app.get('/:locale(en|fr)', (req, res) => {
    res.setLocale(req.params.locale);
    res.cookie('langueChoisie', req.params.locale);

    res.redirect(req.get("referer"));
})




app.get('/chat', (req, res) => {
    res.render('socket_vue.ejs');
})








app.get('/trier/:cle/:ordre', function (req, res) {

    let cle = req.params.cle

    let ordre = (req.params.ordre == 'asc' ? 1 : -1)

    let cursor = db.collection('adresse').find().sort(cle, ordre).toArray(function (err, resultat) {
        if (ordre == 1) {
            ordre = 'desc';
        } else {
            ordre = 'asc';
        }

        res.render('membres.ejs', {
            membres: resultat,
            ordre_url: ordre
        });
    })
})


app.get('/ajouter', function (req, res) {


    db.collection('adresse').save(req.query, (err, result) => {
        if (err) return console.log(err)
        res.redirect('/membres')

    })
})

app.post('/ajouter_ajax', (req, res) => {
    req.body._id = ObjectID(req.body._id)

    db.collection('adresse').save(req.body, (err, result) => {
        if (err) return console.log(err)
        res.send(JSON.stringify(req.body));
        // res.status(204)
    })
})




app.get('/supprimer/:id', (req, res) => {
    let id = req.params.id
    db.collection('adresse').findOneAndDelete({
        "_id": ObjectID(req.params.id)
    }, (err, resultat) => {

        if (err) return console.log(err)
        res.redirect('/membres')
    })
})


app.post('/supprimer_ajax', (req, res) => {
    req.body._id = ObjectID(req.body._id);
    db.collection('adresse').findOneAndDelete({
        "_id": req.body._id
    }, (err, resultat) => {

        if (err) return console.log(err)
        res.send(JSON.stringify(req.body));
    })
})




app.post('/modifier', function (req, res) {


    let oModif = {
        "_id": ObjectID(req.body['_id']),
        nom: req.body.nom,
        prenom: req.body.prenom,
        telephone: req.body.telephone,
        courriel: req.body.courriel
    }


    db.collection('adresse').save(oModif, (err, result) => {
        if (err) return console.log(err)
        res.redirect('/membres')

    })
})


app.post('/modifier_ajax', (req, res) => {
    req.body._id = ObjectID(req.body._id)

    db.collection('adresse').save(req.body, (err, result) => {
        if (err) return console.log(err)
        res.send(JSON.stringify(req.body));
        // res.status(204)
    })
})







let db
MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
    if (err) return console.log(err)
    db = database.db('carnet_adresse')
    server.listen(8081, (err) => {})

})
