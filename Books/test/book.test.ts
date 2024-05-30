import request from 'supertest';
import app from '../app';

describe('Test API Books', () => {
  it('Insert book data base', async () => {
    const book = {
      title: 'Androides Sonham com Ovelhas Elétricas?',
      author: 'Philip K.',
      ISBN: '123-A',
      pageNumber: 200
    };

    const response = await request(app).post('/books').send(book);
    
    expect(response.status).toEqual(201);
    expect(response.body._id).toBeDefined();

    await request(app).delete(`/books/${response.body._id}`);
  });

  it('Find book by id', async () => {
    const book = {
      title: 'Androides Sonham com Ovelhas Elétricas?',
      author: 'Philip K.',
      ISBN: '123-A',
      pageNumber: 200
    };

    const response = await request(app).post('/books').send(book);
    const findBookById = await request(app).get(`/books/${response.body._id}`);

    expect(findBookById.body.title).toEqual(book.title);
    expect(findBookById.body.author).toEqual(book.author);
    expect(findBookById.body.ISBN).toEqual(book.ISBN);
    expect(findBookById.body.pageNumber).toEqual(book.pageNumber);

    await request(app).delete(`/books/${response.body._id}`);
  });

  it('Find all books', async () => {
    const response = await request(app).get('/books');

    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('Update book data base', async () => {
    const book = {
      title: 'Androides Sonham com Ovelhas Elétricas?',
      author: 'Philip K.',
      ISBN: '123-A',
      pageNumber: 200
    };

    const response = await request(app).post('/books').send(book);

    expect(response.status).toEqual(201);

    const bookUpdated = {
      title: 'Androides Sonham com Ovelhas Elétricas? (Update)',
      author: 'Philip K. (Update)',
      ISBN: '123-A (Update)',
      pageNumber: 200
    };

    const responseUpdate = await request(app).put(`/books/${response.body._id}`).send(bookUpdated);

    expect(responseUpdate.status).toEqual(200);

    const findBookUpdated = await request(app).get(`/books/${response.body._id}`);

    expect(findBookUpdated.body.title).toEqual(bookUpdated.title);
    expect(findBookUpdated.body.author).toEqual(bookUpdated.author);
    expect(findBookUpdated.body.ISBN).toEqual(bookUpdated.ISBN);
    expect(findBookUpdated.body.pageNumber).toEqual(bookUpdated.pageNumber);

    await request(app).delete(`/books/${response.body._id}`);
  });


  it('Delete book data base', async () => {
    const book = {
      title: 'Androides Sonham com Ovelhas Elétricas?',
      author: 'Philip K.',
      ISBN: '123-A',
      pageNumber: 200
    };

    const response = await request(app).post('/books').send(book);

    expect(response.status).toEqual(201);
    
    await request(app).delete(`/books/${response.body._id}`);

    const findBookDeleted = await request(app).get(`/books/${response.body._id}`);

    expect(findBookDeleted.status).toEqual(404);
  });
});