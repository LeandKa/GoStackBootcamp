const { response } = require('express');
const request = require('supertest');

const app = require('../../src/app');
const connection = require('../../src/database/connection');




describe('Order', () => {

    beforeEach(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    afterAll(async () => {
        await connection.destroy();
    })

    it('Should create a order', async () => {

        const product = await request(app).post('/products').send({
            name: 'Produto 01',
            price: 500,
            quantity: 50,
        });

        const customer = await request(app).post('/customers').send({
            name: 'Rocketseat',
            email: 'oi@rocketseat.com.br',
        });

        const response = await request(app)
            .post('/orders')
            .send({
                customer_id: customer.body.id,
                products: [
                    {
                        id: product.body.id,
                        quantity: 5,
                        price: 1200
                    },
                ],
            })

        expect(response.body).toEqual(
            expect.objectContaining({
                customer: {
                    id: customer.body.id,
                    name: 'Rocketseat',
                    email: 'oi@rocketseat.com.br'
                },
                order_products: [
                    {
                        id: 1,
                        order_id: 1,
                        product_id: product.body.id,
                        price: 1200,
                        quantity: 5
                    }
                ]
            })
        )
        expect(response.status).toBe(201)

    }),
        it('should not be able to create an order with a invalid customer', async () => {
            const product = await request(app).post('/products').send({
                name: 'Produto 01',
                price: 500,
                quantity: 50,
            });

            const customer = await request(app).post('/customers').send({
                name: 'Rocketseat',
                email: 'oi@rocketseat.com.br',
            });

            const response = await request(app)
                .post('/orders')
                .send({
                    customer_id: 'customer.body.id',
                    products: [
                        {
                            id: product.body.id,
                            quantity: 5,
                            price: 1200
                        },
                    ],
                })

            expect(response.status).toBe(404)

        }),

        it('should not be able to create an order with invalid products', async () => {
            const product = await request(app).post('/products').send({
                name: 'Produto 01',
                price: 500,
                quantity: 50,
            });

            const customer = await request(app).post('/customers').send({
                name: 'Rocketseat',
                email: 'oi@rocketseat.com.br',
            });

            const response = await request(app)
                .post('/orders')
                .send({
                    customer_id: customer.body.id,
                    products: [
                        {
                            id: "product.body.id",
                            quantity: 5,
                            price: 1200
                        },
                    ],
                })

            expect(response.status).toBe(404)



        }),

        it('should not be able to create an order with products with insufficient quantities', async () => {

            const customer = await request(app).post('/customers').send({
                name: 'Rocketseat',
                email: 'oi@rocketseat.com.br',
            });

            const product = await request(app).post('/products').send({
                name: 'Produto 01',
                price: 500,
                quantity: 50,
            });


            const response = await request(app)
                .post('/orders')
                .send({
                    customer_id: customer.body.id,
                    products: [
                        {
                            id: product.body.id,
                            quantity: 500,
                        },
                    ],
                });

                expect(response.status).toEqual(400);

        })

})