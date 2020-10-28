
exports.up = function(knex) {
    return knex.schema.createTable('category',function(table){

        table.string('id').primary;
        table.string('title').notNullable();
        table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); 
    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTable('category');
  
};
