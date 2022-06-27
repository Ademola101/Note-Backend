const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');


const api = supertest(app);

test('note return as json', async () => {
  await api.get('/api/notes').expect(200).expect('Content-Type', /application\/json/);
}, 100000);

test('there are two notes', async () => {
  const response = await api.get('/api/notes');
  expect(response.body).toHaveLength(2);
}, 100000);

test('the first note is about hello', async () => {
  const response = await api.get('/api/notes');
  const firstNote = response.body[0].content;
  expect(firstNote).toBe('Hello word');
}, 100000);
afterAll(() => {
  mongoose.connection.close();
});
