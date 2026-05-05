import { AllowNull, Column, DataType, Default, Index, Length, Min, Model, PrimaryKey, Table } from "sequelize-typescript";

// underscored: true means that if i declare a field name firstName in TS
// the SQL equivalent will be first_name
@Table({
    underscored: true
})
export default class User extends Model {

    @PrimaryKey 
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)   
    id: string
    
    @AllowNull(false)
    @Column(DataType.STRING(30))    
    name: string
    
    @AllowNull(false)
    @Index({unique: true})
    @Column(DataType.STRING(30))    
    username: string
    
    @AllowNull(false)
    @Column(DataType.STRING)    
    password: string

    @AllowNull(true)
    @Column(DataType.STRING)    
    profilePic: string

}