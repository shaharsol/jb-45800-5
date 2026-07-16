db.orders.aggregate([
    {
        $match: {
            ship_state_province: 'FL'
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
    }
])

// match is similar to HOF filter, it allows me to filter
// records before further processing
// of course i can use $match further down the pipeline if i need
// but usually for performance reasons, we will find a $match
// at the beginning of the pipeline

