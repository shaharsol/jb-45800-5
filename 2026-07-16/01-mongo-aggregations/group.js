db.orders.aggregate([
    {
        $group: {
            _id: "$ship_state_province"
        }
    }
])

// this is identical to SQL Group by clause