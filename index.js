const express = require('express');

const app = express();
const cors = require('cors');
require('dotenv').config();
const { query } = require('express');
const Note = require('./models/note');

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8080;

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id',
    });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  return next(error);
};

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('<h1> Hello world </h1>');
});

app.get('/api/notes', (req, res) => {
  // res.json(notes)

  Note.find({}).then((result) => {
    res.json(result);
  });
});

app.get('/api/notes/:id', (req, res, next) => {
  // const id = Number(req.params.id)
  // const note = notes.find((note) => {
  //  return note.id === id}
  //  return statement important in arror
  // )
  // if (note) {
  // res.json(note)
  // }
  // else {
  // res.status(404).end()
  // }

  Note.findById(req.params.id).then((note) => {
    if (note) {
      res.json(note);
    } else {
      res.status.status(204).end();
    }
  }).catch((error) => {
    next(error);
  });
});

app.delete('/api/notes/:id', (req, res, next) => {
  // const id = Number(req.params.id)
  // notes = notes.filter(note => note.id !== id)
  // res.status(204).end()

  Note.findByIdAndRemove(req.params.id).then(() => {
    res.status(204).end();
  }).catch((error) => next(error));
});

app.post('/api/notes', (req, res, next) => {
  const { body } = req;
  if (body.content === undefined) {
    return res.status(400).json({ error: 'content missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  }).catch((error) => next(error));
});

app.put('/api/notes/:id', (req, res, next) => {
  const { content, important } = req.body;

  Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    { new: true, runValidators: true, contex: query }).then((updatedNote) => {
    res.json(updatedNote);
  }).catch((error) => next(error));
});

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
