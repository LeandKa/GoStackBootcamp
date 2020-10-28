
exports.up = function(knex) {
    return knex.schema.createTable('orders_products', function (table) {
        table.increments('id').primary;  
        table.integer('order_id')
        .notNullable()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
        table.decimal('price').notNullable();
        table.integer('quantity').notNullable();
        table.integer('product_id')
        .notNullable()
        .references('id')
        .inTable('products')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('orders_products');
};
