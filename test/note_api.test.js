const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const Note = require('../models/note');
const { initialNotes, notesInDb, nonExistingID } = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(initialNotes);
});

describe('when there is initially some note saved', () => {
  test('notes return as json', async () => {
    await api.get('/api/notes').expect(200).expect('Content-Type', /application\/json/);
  });

  test('all notes return', async () => {
    const response = await api.get('/api/notes');
    expect(response.body).toHaveLength(initialNotes.length);
  });

  test('a specific note is within the return note', async () => {
    const response = await api.get('/api/notes');
    const content = response.body.map((r) => r.content);
    expect(content).toContain('Browser can execute only Javascript');
  });
});

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  };
  await api.post('/api/notes').send(newNote).expect(201).expect('Content-Type', /application\/json/);
  const notesAtEnd = await notesInDb();
  expect(notesAtEnd).toHaveLength(initialNotes.length + 1);
  const contents = notesAtEnd.map((n) => n.content);
  expect(contents).toContain('async/await simplifies making async calls');
});

describe('viewing a specific note', () => {
  test('succed with a valid id', async () => {
    const noteAtStart = await notesInDb();
    const noteToView = noteAtStart[0];
    const resultNote = await api.get(`/api/notes/${noteToView.id}`).expect(200).expect(
      'Content-Type',
      /application\/json/,
    );
    const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

    expect(resultNote.body).toEqual(processedNoteToView);
  });

  test('fail with status code 404 if note does not exist', async () => {
    const validNonExistingId = nonExistingID();
    await api.get(`/api/notes/${validNonExistingId}`).expect(404);
  });

  test('failed with status code 400 bad request if idis invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400);
  });
});

test('a note without content is added', async () => {
  const newNote = {
    important: true,
  };

  await api.post('/api/notes').send(newNote).expect(400);

  const notesAtEnd = await notesInDb();
  expect(notesAtEnd).toHaveLength(initialNotes.length);
});

test('a note can be deleted', async () => {
  const notesAtStart = await notesInDb();
  const noteToDelete = notesAtStart[0];

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204);

  const notesAtEnd = await notesInDb();

  expect(notesAtEnd).toHaveLength(
    initialNotes.length - 1,
  );

  const contents = notesAtEnd.map((r) => r.content);

  expect(contents).not.toContain(noteToDelete.content);
});

describe('deletion of a note', () => {
  test('succed with status code 204 if the data is valid', async () => {
    const notesAtStart = await notesInDb();
    const noteToDelete = notesAtStart[0];

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204);

    const notesAtEnd = await notesInDb();

    expect(notesAtEnd).toHaveLength(
      initialNotes.length - 1,
    );

    const contents = notesAtEnd.map((r) => r.content);

    expect(contents).not.toContain(noteToDelete.content);
  });
});
afterAll(() => {
  mongoose.connection.close();
});
