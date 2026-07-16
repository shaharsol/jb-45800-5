db.orders.aggregate([
    {
        $unwind: "$details"
    },
    {
        $group: {
            _id: "$ship_state_province",
            quantitySum: {$sum: "$details.quantity"}
        }
    },
    {
        $sort: {
            quantitySum: -1
        }
    }
])

// this is identical to SQL Group by clause