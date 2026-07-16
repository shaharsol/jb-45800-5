// calculate the top 5 cities, per total shipping fee per city
// 
db.orders.aggregate([
    {
        $group: {
            _id: "$ship_city",
            totalShippingCost: {$sum: "$shipping_fee"},
            numberOfOrders: {$sum: 1},
            averageShippingCost: {$avg: "$shipping_fee"}
        }
    },
    {
        $match: {
            totalShippingCost: {$gte: 400}
        }
    },
    {
        $sort: {
            totalShippingCost: -1
        }
    },
    {
        $limit: 5
    }
])