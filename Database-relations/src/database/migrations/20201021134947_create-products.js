
exports.up = function(knex) {
    return knex.schema.createTable('products', function (table) {
        table.increments('id').primary;
        table.string('name').notNullable();
        table.decimal('price').notNullable();
        table.integer('quantity').notNullable();
        table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();  
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('products');
};
