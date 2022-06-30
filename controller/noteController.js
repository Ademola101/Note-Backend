const notesRouter = require('express').Router();

const Note = require('../models/note');

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

notesRouter.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);
  return note ? res.json(note) : res.status(404).end();
});

notesRouter.post('/', async (req, res) => {
  const { content, important } = req.body;
  const newNote = new Note({
    content,
    important,
    date: new Date(),
  });

  const savedNote = await newNote.save();
  res.status(201).json(savedNote);
});

notesRouter.delete('/:id', async (req, res) => {
  await Note.findByIdAndRemove(req.params.id);
  res.status(204).end();
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
