const request = require('supertest');

const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('Customer',()=>{

    beforeEach(async()=>{
         await connection.migrate.rollback();
       await connection.migrate.latest();
    });

    afterAll(async()=>{
        await connection.destroy();
    })

    it('Should create a customer',async ()=>{

        const response = await request(app)
        .post('/customers')
        .send({
            name:'Leandro',
            email:'email@email.com'
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id');
    }),


    it("Should not create a customer with email already the database",async ()=>{
        const response = await request(app)
        .post('/customers')
        .send({
            name:'Leandro',
            email:'email@email.com'
        })
        expect(response.body).toHaveProperty('id');

      const response2 = await request(app)
        .post('/customers')
        .send({
            name:'Leandro',
            email:'email@email.com'
        })
        expect(response2.status).toBe(400)
    })

})