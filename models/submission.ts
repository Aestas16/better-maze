import * as TypeORM from "typeorm";
import Model from "./common";

import User from "./user";

enum Status {
  ACCEPTED = "Accepted",
  COMPILE_ERROR = "Compile Error",
  MEMORY_LIMIT_EXCEEDED = "Memory Limit Exceeded",
  RUNTIME_ERROR = "Runtime Error",
  SYSTEM_ERROR = "System Error",
  TIME_LIMIT_EXCEEDED = "Time Limit Exceeded",
  INVALID_OUTPUT = "Invalid Output",
  WAITING = "Waiting",
  JUDGING = "Judging"
}

@TypeORM.Entity()
export default class Submission extends Model {
  @TypeORM.PrimaryGeneratedColumn()
  id: number;

  @TypeORM.Column({ nullable: true, type: "mediumtext" })
  code: string;

  @TypeORM.Column({ nullable: true, type: "enum", enum: Status })
  status: Status;

  @TypeORM.Column({ nullable: true, type: "integer", default: 0 })
  time: number;

  @TypeORM.Column({ nullable: true, type: "integer", default: 0 })
  code_length: number;

  @TypeORM.Column({ nullable: true, type: "integer", default: 0 })
  memory: number;

  @TypeORM.Column({ nullable: true, type: "integer", default: 998244353 })
  step: number;

  @TypeORM.Index()
  @TypeORM.Column({ nullable: true, type: "integer" })
  user_id: number;

  @TypeORM.Column({ nullable: true, type: "integer" })
  submit_time: number;

  user?: User;

  async loadRelationships() {
    if (!this.user) {
      this.user = await User.findById(this.user_id);
    }
  }
}
