const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Note = require('../models/note');

const api = supertest(app);

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
];

beforeEach(async () => {
  await Note.deleteMany({});
  let noteObject = new Note(initialNotes[0]);
  await noteObject.save();
  noteObject = new Note(initialNotes[1]);
  noteObject.save();
});

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
afterAll(() => {
  mongoose.connection.close();
});
