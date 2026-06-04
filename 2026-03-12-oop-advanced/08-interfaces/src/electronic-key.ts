export default interface ElectronicKey {
    weight: number
    voltage: number
    openVehicle(): void
    lockVehicle(): void
}