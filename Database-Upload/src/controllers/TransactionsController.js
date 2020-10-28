const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const csv = require('csvtojson');

let transaction = {
    id: '',
    title: '',
    type: '',
    category_id: ''
}

module.exports = {

    async index(request, response) {

        const Transactions = [];

        const transactionFindInCome = await db('transaction').select('*').where({ type: 'income' });
        const transactionFindOutCome = await db('transaction').select('*').where({ type: 'outcome' });

        const income = transactionFindInCome.reduce(function (sum, item) {
            return sum = sum + item.value;
        }, 0)
        const outcome = transactionFindOutCome.reduce(function (sum, item) {
            return sum = sum + item.value
        }, 0)
        const sum = income - outcome

        const Transaction = await db('transaction')
            .join('category', 'transaction.category_id', '=', 'category.id')
            .select("transaction.id", "transaction.title",
                "transaction.type", "transaction.value", 'transaction.created_at', 'transaction.updated_at',
                'category.id', 'category.created_at', 'category.updated_at',
                'category.title as category_title', 'category.id as category_id',
                'category.updated_at as category_update', 'category.created_at as category_created')

        Transaction.map(trans => {
            Transactions.push({
                id: trans.id,
                title: trans.title,
                type: trans.type,
                category: {
                    id: trans.category_id,
                    title: trans.category_title,
                    created_at: trans.category_update,
                    update_at: trans.category_created
                },
                created_at: trans.created_at,
                updated_at: trans.updated_at
            })
        })

        return response.status(201).json({
            Transactions,
            Balance: {
                income: income,
                outcome: outcome,
                total: sum
            }
        })

    },

    async create(request, response) {
        const { title, value, type, category } = request.body;

        const categoryFind = await db('category').select('*').where({
            title: category
        })
        if (categoryFind == 0) {
            const categoryInsert = await db('category').insert({
                id: uuidv4(),
                title: category
            })

            transaction = {
                id: uuidv4(), title, value, type,
                category_id: categoryInsert[0].id
            }
        } else {
            transaction = {
                id: uuidv4(), title, value, type,
                category_id: categoryFind[0].id
            }
        }



        switch (type) {
            case "income":
                    const TransactionsInsert = await db('transaction').insert(transaction)
                    return response.status(201).send()

            case "outcome":
                const transactionFindInCome = await db('transaction').select('*').where({ type: 'income' });
                const transactionFindOutCome = await db('transaction').select('*').where({ type: 'outcome' });

                const income = transactionFindInCome.reduce(function (sum, item) {
                    return sum = sum + item.value;
                }, 0)
                const outcome = transactionFindOutCome.reduce(function (sum, item) {
                    return sum = sum + item.value
                }, 0)
                const sum = income - (outcome + value)
                if (sum < 0) {
                    console.log(sum)
                    return response.status(400).json({
                        error: 'Not accept invalid balance number'
                    })
                } else {
                    const TransactionsInsert = await db('transaction').insert(transaction)

                    return response.status(201).json({
                        InCome: income,
                        Outcome: (outcome + value),
                        Balance: sum
                    })
                }
        }
    },

    async delete(request, response) {
        const { id } = request.params;

        const deleteTransations = await db('transaction').where('id', id).delete()

        if (deleteTransations == 1) {
            return response.status(200).send();
        }
    },

    async import(request, response) {

        try {

            const archive = request.file;
            const csvFilePath = path.resolve(archive.path);
            const result = await csv().fromFile(csvFilePath);

            result.forEach(value => {
              
                db('category').select('*').where({
                    title: value.category
                }).first().then(result => {
                    if (result == undefined) {
                        const categorNew = {
                            id:uuidv4(),
                            title:value.category
                        } 
                        db('category').insert(categorNew).then(result => {
                            const object = {
                                id: uuidv4(),
                                title: value.title,
                                category_id: categorNew.id,
                                type: value.type,
                                value: value.value
                            }

                            db('transaction').insert(object)
                                .then(result => {
                                    console.log('Aqui e fazendo a categoria pela primeira vez')
                                })
                        })
                    } else {
                        if (result.title === value.category) {
                            let id = result.id
                            const object = {
                                id: uuidv4(),
                                title: value.category,
                                category_id: id,
                                type: value.type,
                                value: value.value
                            }

                            db('transaction').insert(object)
                                .then(result => {
                                    console.log('Aqui e ja fazendo a categoria ja adicionada')
                                })

                        } 
                    }
                })
            })


            return response.status(201).send();
        } catch (error) {
            return response.status(400).send();
        }
    }

}