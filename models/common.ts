import * as TypeORM from "typeorm";

export default class Model extends TypeORM.BaseEntity {
    static async findById<T extends TypeORM.BaseEntity>(this: TypeORM.ObjectType<T>, id?: number): Promise<T | undefined> {
        return await (this as any).findOne({
            where: {
                id: parseInt(id as any) || 0
            }
        });
    }

    async save(): Promise<this> {
        await super.save();
        return this;
    }

    static async queryByOrder(order) {
        return await this.createQueryBuilder().orderBy(order).getMany();
    }
}