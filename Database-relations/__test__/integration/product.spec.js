const request = require('supertest');

const app = require('../../src/app');

const connection = require('../../src/database/connection');


describe('Product',()=>{
    beforeEach(async()=>{
        await connection.migrate.rollback();
        await connection.migrate.latest();
     });
 
     afterAll(async()=>{
         await connection.destroy();
     })

     
     it('Should create a product',async ()=>{
         const response = await request(app)
         .post('/products')
         .send({
             name:"Product 1",
             price:123,
             quantity:12
         })
         expect(response.status).toBe(201);
         expect(response.body).toHaveProperty('id');
     }),

     it('Should not create a product duplicated',async ()=>{
         const response = await request(app)
         .post('/products')
         .send({
            name:"Product 1",
            price:123,
            quantity:12
        })
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');


        const responseError = await request(app)
        .post('/products')
        .send({
            name:"Product 1",
            price:123,
            quantity:12
        })
        expect(responseError.status).toBe(400);


     })


})