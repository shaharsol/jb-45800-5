import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    underscored: true,
    tableName: 'content_guidelines',
})
export default class ContentGuideline extends Model {

    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    title: string

    @AllowNull(false)
    @Column(DataType.TEXT)
    text: string

    @AllowNull(false)
    @Column({
        type: 'vector(1536)',
    })
    vector: number[]
}
