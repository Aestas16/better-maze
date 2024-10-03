import * as TypeORM from "typeorm";
import Model from "./common";

@TypeORM.Entity()
export default class User extends Model {
  @TypeORM.PrimaryGeneratedColumn()
  id: number;

  @TypeORM.Index({ unique: true })
  @TypeORM.Column({ nullable: true, type: "varchar", length: 80 })
  username: string;

  @TypeORM.Column({ nullable: true, type: "varchar", length: 120 })
  password: string;

  @TypeORM.Column({ nullable: true, type: "integer" })
  mazestep: number;

  static async findByName(name): Promise<User> {
    return User.findOne({
        where: { username: String(name) }
    });
  }
}