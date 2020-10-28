

exports.up = function (knex) {
    return knex.schema.createTable('customer', function (table) {
        table.increments('id').primary;
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
        
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('customer');
};
