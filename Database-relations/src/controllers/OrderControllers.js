
const db = require('../database/connection');

module.exports = {

    async index(request, response) {

        const { id } = request.params;

        if (!id) {
            return response.status(404).send()
        }

        try {
 
            const order = await db('customer')
                .join("orders", 'customer.id', '=', 'orders.customer_id')
                .where('orders.id', id)
                .select('orders.*', 'customer.*',
                    'orders.updated_at as customed_update', 'orders.created_at as customed_created')
                .first()
            const productOrders = await db.select('*')
                .from("orders_products")
                .where("order_id", id)
                .join('products', 'product_id', '=', 'products.id')
                .select('*')

                if(productOrders.length == 0){
                    return response.status(404).send()
                }

            return response.status(200).json({ order, productOrders })
        } catch (error) {
            return response.status(400).send()
        }
    },
    async create(request, response) {

        const { customer_id, products } = request.body;

        try {

            if (!customer_id || !products) {
                return response.status(404).send()
            }

            const customer = await db('customer')
                .select('customer.*')
                .where('customer.id', customer_id)
            if (customer.length == 0) {
                return response.status(404).send()
            }
            products.map(product => {
                db('products').select('products.*').where('products.id', product.id).first()
                    .then(result => {
                        if (result == undefined) {
                            return response.status(404).send()
                        } else {
                            if (product.quantity > result.quantity) {
                                return response.status(400).send()
                            } else {
                                let aux = result.quantity - product.quantity
                                if (aux < 0) {
                                    return response.status(400).send()
                                }
                                db('products').update('quantity', aux)
                                    .where('products.id', product.id)
                                    .then(result => {
                                        if (result) {
                                            return
                                        }
                                    })
                            }
                        }
                    })
            })

            const insertedOrder = await db('orders').insert({
                customer_id
            })



            const order_id = insertedOrder[0]

            const productOrders = products.map(product => {
                var product_id = product.id
                var quantity = product.quantity
                var price = product.price
                return {
                    product_id,
                    quantity,
                    order_id,
                    price
                }
            })

            const order_table = await db('orders_products').insert(productOrders);

            const order = await db('customer')
                .join("orders", 'customer.id', '=', 'orders.customer_id')
                .where('orders.id', order_id)
                .select('orders.*', 'customer.*',
                    'orders.updated_at as customed_update', 'orders.created_at as customed_created')
                .first()

            const products_orders = await db('orders_products')
                .select(['orders_products.*'])
                .whereRaw('`orders_products`.`order_id` =  ??', [order_id])


            return response.status(201).json({
                create_at: order.create_at,
                update_at: order.update_at,
                customer: {
                    id: order.customer_id,
                    name: order.name,
                    email: order.email,
                    create_at: order.customer_update,
                    update_at: order.customer_created,
                },
                order_products: products_orders
            })

        } catch (error) {
            return response.status(500).send()
        }
    }

}