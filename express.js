const fs = require('fs');
//const 

//import express and node js
const express = require('express');
const path = require('path');

//initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

//landing page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//notes page routh
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




