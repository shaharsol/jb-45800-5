import { DataTypes, Utils } from 'sequelize'
import { toSql } from './pgvector'

const ABSTRACT = DataTypes.ABSTRACT.prototype.constructor

class VECTOR extends ABSTRACT {
    constructor(private dimensions?: number) {
        super()
    }

    toSql() {
        return this.dimensions ? `vector(${this.dimensions})` : 'vector'
    }

    _stringify(value: number[]) {
        return toSql(value)
    }
}

VECTOR.prototype.key = VECTOR.key = 'vector'
;(DataTypes as typeof DataTypes & { VECTOR: typeof VECTOR }).VECTOR =
    Utils.classToInvokable(VECTOR)
