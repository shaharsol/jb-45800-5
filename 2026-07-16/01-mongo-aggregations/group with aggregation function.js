db.orders.aggregate([
    {
        $group: {
            _id: "$ship_state_province",
            orderCount: {$sum: 1}
        }
    },
    {
        $sort: {
            orderCount: -1
        }
    }
])

// this is identical to SQL Group by clause