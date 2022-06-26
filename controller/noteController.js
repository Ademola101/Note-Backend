const notesRouter = require('express').Router();

const Note = require('../models/note');

notesRouter.get('/', (req, res) => {
  Note.find({}).then(notes => {

    res.json(notes)
  })
});


notesRouter.get('/:id', (req, res, next) => {
  Note.findById(req.params.id).then(note => {
    if (note) {
      res.json(note)
    }

    else {
      res.status(204).end()
    }
  }).catch(error => next(error))


});


notesRouter.post("/", (req, res, next) => {
const body = req.body;
const newNote = new Note( {
  content: body.content,
  important: body.important,
  date: new Date
});

newNote.save().then(savedNote => {
  res.json(savedNote)
}).catch(error => next(error))

});




notesRouter.delete("/:id", (req, res, next) => {
  Note.findByIdAndRemove( req.params.id).then(() => {
res.status(204).end()
  }).catch(error => next(error))
});

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter