import { AllowNull, Column, DataType, Default, Index, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    underscored: true
})
export default class IvoryProduct extends Model {

    
    @PrimaryKey 
    @AllowNull(false)
    @Column(DataType.STRING)   
    barcode: string

    @AllowNull(false)
    @Column(DataType.STRING)   
    title: string

    @AllowNull(false)
    @Column(DataType.INTEGER)    
    price: number

}