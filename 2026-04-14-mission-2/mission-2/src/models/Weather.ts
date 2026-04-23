export default interface Weather {
    location: {
        name: string,
        country :string
    },
    current: {
        temp_c: number,
        condition: {
            text: string,
            icon: string
        }
    }
}