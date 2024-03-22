const fs = require('fs');

//import express and node js
const express = require('express');
const path = require('path');

//initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


//notes page route
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});


app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Interal server error' });
            return;
        }
        res.json(JSON.parse(data));
    });
});


app.post('/api/notes', (req, res) => {

    const { title, text } = req.body;
    if (!title || !text) {
        res.status(400).json({ error: 'Title and Text are returned' });
        return;
    }
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Interal server error' });
            return;
        }

        const notes = JSON.parse(data);
        const newNote = { id: generateUniqueId(), title, text };
        notes.push(newNote);
        console.log(newNote);

        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Interal server error' });
                return;
            }
            res.json(newNote);
        });
    });
});

//delete note by id
app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        let notes = JSON.parse(data);
        const updateNotes = notes.filter(note => note.id !== noteId);
        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(updateNotes), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Interal server error' });
                return;
            }
            res.json({ message: 'Note has successfully deleted' });
        });
    });
});

function generateUniqueId() {
    return Math.floor(Math.random() * 1000);
}

//landing page route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

