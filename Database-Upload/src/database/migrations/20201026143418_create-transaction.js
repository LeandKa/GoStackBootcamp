
exports.up = function(knex) {
  return knex.schema.createTable('transaction',function(table){
      table.string('id').primary();
      table.string('title').notNullable();
      table.decimal('value').notNullable();
      table.string('type').notNullable();

      table.string('category_id').notNullable();
      table.foreign('category_id').references('id').inTable('category');

      table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); 

  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('transaction');
};
