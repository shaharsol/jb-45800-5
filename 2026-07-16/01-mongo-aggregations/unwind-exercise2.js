// calculate the revenue per customer and display top 10 customers by revenue


db.orders.aggregate([
    {
        $match: {
            customer_id: 11
        }
    },
    {
        $unwind: "$details"
    },
    {
        $group: {
            _id: "$_id",
            lineItemsCount: {$sum: 1},
            totalQuantity: {$sum: "$details.quantity"},
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
