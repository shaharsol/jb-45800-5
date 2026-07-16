// display a list of orders and their price (price = quantity * unit_price) per each detail line

db.orders.aggregate([
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
