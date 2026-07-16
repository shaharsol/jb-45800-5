db.orders.aggregate([
    {
        $match: {
            ship_state_province: {$in: ['FL', 'OR']}
        },
    },
    {
        $project: {
            _id: 1,
            customer_id: 1,
            order_date: 1,
            ship_city: 1,
            shipping_fee: 1
        }        
    },
    {
        $sort: {
            shipping_fee: -1
        }
    },
    {
        $limit: 5
    }
])

// $sort is very similar to HOF sort
