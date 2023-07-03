import request from 'supertest';
import { server } from '../../src';
import { StatusCodes } from '../../src/types/enums';
import { UserRequest } from '../../src/types/interfaces';
import { v4 as uuid } from 'uuid';

const userData: UserRequest = {
  username: 'Ivan',
  age: 32,
  hobbies: ['football'],
};

const updatedData: UserRequest = {
  username: 'Ivan',
  age: 33,
  hobbies: ['football'],
};

afterAll((done) => {
  server.close();
  done();
});

describe('CRUD operations with correct data', () => {
  it('should send empty array', async () => {
    await request(server).get('/api/users').expect(StatusCodes.OK, []);
  });

  it('should send empty array, check "/"', async () => {
    await request(server).get('/api/users/').expect(StatusCodes.OK, []);
  });

  it('should create user', async () => {
    const response = await request(server).post('/api/users').send(userData);
    expect(response.statusCode).toBe(StatusCodes.Created);
    const createdUser = response.body;
    expect(createdUser).toEqual({ ...userData, id: createdUser.id });
    await request(server).get('/api/users').expect(StatusCodes.OK, [createdUser]);
  });

  it('should send list with user', async () => {
    const response = await request(server).get('/api/users');
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body).toHaveLength(1);
  });

  it('should send user by id', async () => {
    const response = await request(server).get('/api/users');
    const user = response.body[0];
    const { id } = user;
    await request(server).get(`/api/users/${id}`).expect(StatusCodes.OK, user);
  });

  it('should update user', async () => {
    const response = await request(server).get('/api/users');
    const user = response.body[0];
    const { id } = user;
    const updateUserResponse = await request(server)
      .put(`/api/users/${id}`)
      .send(updatedData)
      .expect(StatusCodes.OK);
    const updatedUser = updateUserResponse.body;
    expect(updatedUser).toEqual({ ...updatedData, id });
  });

  it('should delete user', async () => {
    const response = await request(server).get('/api/users');
    const user = response.body[0];
    const { id } = user;
    await request(server).delete(`/api/users/${id}`).expect(StatusCodes.OK);
  });

  it('should send empty array after delete', async () => {
    await request(server).get('/api/users').expect(StatusCodes.OK, []);
  });
});

const validId = uuid();

describe('CRUD operations with with Error - 404', () => {
  it("should return 404 if user doesn't exist", async () => {
    await request(server).get(`/api/users/${validId}`).expect(StatusCodes.NotFound);
  });

  it('should return 404 if get a nonexistent user', async () => {
    await request(server).get(`/api/users/${validId}`).expect(StatusCodes.NotFound);
  });

  it('should return 404 if delete a nonexistent user', async () => {
    await request(server).delete(`/api/users/${validId}`).expect(StatusCodes.NotFound);
  });

  it('should return 404 if update a nonexistent user', async () => {
    await request(server).put(`/api/users/${validId}`).send(userData).expect(StatusCodes.NotFound);
  });

  it('should return 404 if update user with invalid data', async () => {
    const invalidData = {};
    await request(server)
      .put(`/api/users/${validId}`)
      .send(invalidData)
      .expect(StatusCodes.NotFound);
  });
});

describe('Body validation', () => {
  it('should handle wrong data types in user data', async () => {
    const invalidName = {
      userName: 1,
      age: 20,
      hobbies: ['lalala'],
    };
    await request(server).post('/api/users').send(invalidName).expect(StatusCodes.BadRequest);

    const invalidAge = {
      userName: 'Ivan',
      age: '20',
      hobbies: ['lalala'],
    };
    await request(server).post('/api/users').send(invalidAge).expect(StatusCodes.BadRequest);

    const invalidHobbies = {
      userName: 'Ivan',
      age: 20,
      hobbies: { hobby: 0 },
    };
    await request(server).post('/api/users').send(invalidHobbies).expect(StatusCodes.BadRequest);

    const invalidHobbiesType = {
      userName: 'Ivan',
      age: 20,
      hobbies: [1, 2, 3],
    };
    await request(server).post('/api/users').send(invalidHobbies).expect(StatusCodes.BadRequest);
  });

  it('should handle missing fields in user data', async () => {
    const data = {
      age: 28,
      hobbies: ['lalala'],
    };
    await request(server).post('/api/users').send(data).expect(StatusCodes.BadRequest);

    const data2 = {
      userName: 'Ivan',
      hobbies: ['lalala'],
    };
    await request(server).post('/api/users').send(data2).expect(StatusCodes.BadRequest);

    const data3 = {
      userName: 'Ivan',
      age: 30,
    };
    await request(server).post('/api/users').send(data3).expect(StatusCodes.BadRequest);
  });
});

describe('CRUD operations with Error - 400', () => {
  it('should return 400 if invalid id', async () => {
    await request(server).get('/api/users/id').expect(StatusCodes.BadRequest);
  });

  it('should return 400 if delete user by invalid id', async () => {
    await request(server).delete('/api/users/id').expect(StatusCodes.BadRequest);
  });

  it('should return 400 if create user with invalid data', async () => {
    const invalidData = {};
    await request(server).post('/api/users').send(invalidData).expect(StatusCodes.BadRequest);
  });
});
