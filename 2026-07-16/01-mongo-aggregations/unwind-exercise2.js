// calculate the revenue per customer and display top 10 customers by revenue


db.orders.aggregate([
    {
        $unwind: "$details"
    },
    {
        $group: {
            _id: "$customer_id",
            totalPrice: {$sum: {$multiply: ["$details.quantity", "$details.unit_price"]}}
        }
    },
    {
        $sort: {
            totalPrice: -1
        }
    },
    {
        $limit: 10
    }
])
