const Note = require('../models/note');

const initialNotes = [{
  content: 'HTML is easy',
  date: new Date(),
  important: false,
},
{
  content: 'Browser can execute only Javascript',
  date: new Date(),
  important: true,
}];

const nonExistingID = async () => {
  const note = new Note({
    content: 'to be removed',
    date: new Date(),
  });

  await note.save();
  await note.remove();
  return note._id.toString();
};

const noteInDb = async () => {
  const notes = await Note.find({});
  return notes.map((note) => note.toJSON);
};

module.exports = {
  initialNotes,
  noteInDb,
  nonExistingID,
};
