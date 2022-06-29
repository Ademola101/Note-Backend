const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Note = require('../models/note');
const { initialNotes, noteInDb, nonExistingID } = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Note.deleteMany({});

  const noteObjects = initialNotes
    .map((note) => new Note(note));
  const promiseArray = noteObjects.map((note) => note.save());
  await Promise.all(promiseArray);
}, 100000);
test('note return as json', async () => {
  await api.get('/api/notes').expect(200).expect('Content-Type', /application\/json/);
}, 100000);

test('all notes return', async () => {
  const response = await api.get('/api/notes');
  expect(response.body).toHaveLength(initialNotes.length);
}, 100000);

test('a specific note is within the return note', async () => {
  const response = await api.get('/api/notes');
  const content = response.body.map((r) => r.content);
  expect(content).toContain('Browser can execute only Javascript');
}, 100000);

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  };
  await api.post('/api/notes').send(newNote).expect(201).expect('Content-Type', /application\/json/);
  const notesAtEnd = await noteInDb();
  expect(notesAtEnd).toHaveLength(initialNotes.length + 1);
  const contents = notesAtEnd.map((n) => n.content);
  expect(contents).toContain('async/await simplifies making async calls');
}, 100000);

test('a note without content is added', async () => {
  const newNote = {
    important: true,
  };

  await api.post('/api/notes').send(newNote).expect(400);

  const notesAtEnd = await noteInDb();
  expect(notesAtEnd).toHaveLength(initialNotes.length);
}, 100000);

test('a specific note can be viewed', async () => {
  const noteAtStart = await noteInDb();
  const noteToView = noteAtStart[0];
  const resultNote = await api.get(`/api/notes/${noteToView.id}`).expect(200).expect(
    'Content-Type',
    /application\/json/,
  );
  const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

  expect(resultNote.body).toEqual(processedNoteToView);
}, 100000);

test('a note can be deleted', async () => {
  const notesAtStart = await noteInDb();
  const noteToDelete = notesAtStart[0];

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204);

  const notesAtEnd = await noteInDb();

  expect(notesAtEnd).toHaveLength(
    initialNotes.length - 1,
  );

  const contents = notesAtEnd.map((r) => r.content);

  expect(contents).not.toContain(noteToDelete.content);
}, 100000);
afterAll(() => {
  mongoose.connection.close();
});
