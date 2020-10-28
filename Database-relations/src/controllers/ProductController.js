const db = require('../database/connection');

module.exports = {
    
    async index(request,response){

        const total = await db('products').select("*");
        return response.json(total);

    },
    

    async create(request,response){
        const {name,price,quantity} = request.body;

        const findNameProduct = await db('products').where('name',name);

        if(findNameProduct.length > 0){
            return response.status(400).send();
        }else{
            const product = await db('products').insert({
                name,price,quantity
            })
            const product_id= product[0];
            return response.status(201).json({
                "id":product_id
            })
        }

    }
}