db.orders.aggregate([
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