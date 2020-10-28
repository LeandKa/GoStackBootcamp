const db = require('../database/connection');

module.exports = {

    async index(request, response) {

        const total = await db('customer').select('*');
        return response.json(total);

    },


    async create(request, response) {
        const { name, email } = request.body;

        const usuarioCheckEmail = await db('customer').where('email', email)

        if (usuarioCheckEmail.length > 0) {
            return response.status(400).send()
        } else {
            const usuario = await db('customer').insert({
                name,
                email
            })
            const customer_id = usuario[0]
            return response.status(201).json({
                "id":customer_id
            })
        }
    }

}