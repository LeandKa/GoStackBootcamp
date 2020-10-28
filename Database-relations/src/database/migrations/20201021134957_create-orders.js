
exports.up = function(knex) {
    return knex.schema.createTable('orders', function (table) {
        table.increments('id').primary;
        table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();  
        table.integer('customer_id')
        .notNullable()
        .references('id')
        .inTable('customer')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('orders');
};
