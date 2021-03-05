require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    const fave = {
      name: 'Parker',
      portrayed: 'parker',
      nickname: 'Parkers',
      img: 'http://www.placekitten.com/300/300'
    };
    const myfav = {
      ...fave,
      owner_id: 2,
      id: 4,
    };

    test('make a new fave', async() => {

      const fave = {
        name: 'Parker',
        portrayed: 'parker',
        nickname: 'Parkers',
        img: 'http://www.placekitten.com/300/300'
      };

      const data = await fakeRequest(app)
        .post('/api/favorites')
        .send(fave)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body[0]).toEqual(myfav);
    });

    test('returns all favs for a given user', async() => {
      const data = await fakeRequest(app)
        .get('/api/favorites')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body[0]).toEqual(myfav);
    });

    /*test('delets a favorite', async() => {
      const data = await fakeRequest(app)
        .delete('/api/favorites/4')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual([]);
    });*/
  });
});
