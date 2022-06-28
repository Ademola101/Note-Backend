const notesRouter = require('express').Router();

const Note = require('../models/note');

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

notesRouter.get('/:id', (req, res, next) => {
  Note.findById(req.params.id).then((note) => {
    if (note) {
      res.json(note);
    } else {
      res.status(204).end();
    }
  }).catch((error) => next(error));
});

notesRouter.post('/', async (req, res, next) => {
  const { content, important } = req.body;
  const newNote = new Note({
    content,
    important,
    date: new Date(),
  });
  try {
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (exception) {
    next(exception);
  }
});

notesRouter.delete('/:id', (req, res, next) => {
  Note.findByIdAndRemove(req.params.id).then(() => {
    res.status(204).end();
  }).catch((error) => next(error));
});

notesRouter.put('/:id', (request, response, next) => {
  const { body } = request;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
