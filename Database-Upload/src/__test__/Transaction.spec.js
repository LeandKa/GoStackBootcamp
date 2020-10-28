const request = require('supertest');
const { path } = require('../app');

const app = require('../app');

const connection = require('../database/connection');



describe('Transaction', () => {

    beforeEach(async()=>{
        await connection.migrate.rollback();
        await connection.migrate.latest();
   });

   afterAll(async()=>{
       await connection.destroy();
   })


    it('should be able to create a new transaction', async () => {

        const response = await request(app).post('/transactions').send({
            title: 'March Salary',
            type: 'income',
            value: 4000,
            category: 'Salary'
        });

        expect(response.status).toBe(201)
    });


    it('should create tags when inserting new transactions', async () => {

        const response = await request(app).post('/transactions').send({
            title: 'March Salary',
            type: 'income',
            value: 4000,
            category: 'Salary'
        });

        expect(response.body).toMatchObject
            (expect.objectContaining({
                category: expect.any(String)
            }),
            );
    });


    it('should not create tags when they already exists',async ()=>{
        const insertCategory = connection('category').insert({
           title:'Salary'
        })
        
        await request(app).post('/transactions')
        .send({
            title:'March Salary',
            type: 'income',
            value: 4000,
            category: 'Salary'
        })

        const category = await connection('category').select('*').where({
            title:'Salary'
        })

        expect(insertCategory).toBeTruthy();
        expect(category).toHaveLength(1);
        expect(request.status).toBe(400);
    });



    it('shoul not be able to create outcome transaction witout a valid balance',async () =>{

        await request(app).post('/transactions').send({
           title:'March Salary',
           type: 'income',
           value: 4000,
           category:'Salary'
        });

        const response = await request(app).post('/transactions').send({
            title:'iPhone',
            type:'outcome',
            value:4500,
            category:'Eletronics'
        });

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject(
            expect.objectContaining({
                status:'error',
                message:expect.any(String)
            }),
        );
    });

    it('should be able to delete a transaction',async()=>{

        const response = await request(app).post('/transactions').send({
            title:'March Salary',
            type: 'income',
            value: 4000,
            category: 'Salary'
        });

       const responseDel = await request(app).delete(`transactions/${response.body.id}`);

        expect(responseDel).toBe(200);

    });


    it('should be able to import a transactions',async () =>{

        const importCSV = path.resolve(__dirname,'import_template.csv');

        await request(app).post('/transactions/import').attach('file',importCSV);

        const response = await request(app).get('/transactions');

        expect(response).toHaveLength(3);
        expect(response).toBe(200);
        expect(transactions).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                title: 'Loan',
                type: 'income',
              }),
              expect.objectContaining({
                title: 'Website Hosting',
                type: 'outcome',
              }),
              expect.objectContaining({
                title: 'Ice cream',
                type: 'outcome',
              }),
            ]),
          );
    });

})