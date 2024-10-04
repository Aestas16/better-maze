"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TypeORM = require("typeorm");
const common_1 = require("./common");
const user_1 = require("./user");
var Status;
(function (Status) {
    Status["ACCEPTED"] = "Accepted";
    Status["COMPILE_ERROR"] = "Compile Error";
    Status["MEMORY_LIMIT_EXCEEDED"] = "Memory Limit Exceeded";
    Status["RUNTIME_ERROR"] = "Runtime Error";
    Status["TIME_LIMIT_EXCEEDED"] = "Time Limit Exceeded";
    Status["INVALID_INTERACTION"] = "Invalid Interaction";
    Status["WAITING"] = "Waiting";
    Status["JUDGING"] = "Judging";
})(Status || (Status = {}));
let Submission = class Submission extends common_1.default {
    loadRelationships() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.user) {
                this.user = yield user_1.default.findById(this.user_id);
            }
        });
    }
};
__decorate([
    TypeORM.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Submission.prototype, "id", void 0);
__decorate([
    TypeORM.Column({ nullable: true, type: "mediumtext" }),
    __metadata("design:type", String)
], Submission.prototype, "code", void 0);
__decorate([
    TypeORM.Column({ nullable: true, type: "enum", enum: Status }),
    __metadata("design:type", String)
], Submission.prototype, "status", void 0);
__decorate([
    TypeORM.Column({ nullable: true, type: "integer", default: 0 }),
    __metadata("design:type", Number)
], Submission.prototype, "time", void 0);
__decorate([
    TypeORM.Column({ nullable: true, type: "integer", default: 0 }),
    __metadata("design:type", Number)
], Submission.prototype, "code_length", void 0);
__decorate([
    TypeORM.Column({ nullable: true, type: "integer", default: 0 }),
    __metadata("design:type", Number)
], Submission.prototype, "memory", void 0);
__decorate([
    TypeORM.Column({ nullable: true, type: "integer", default: 998244353 }),
    __metadata("design:type", Number)
], Submission.prototype, "step", void 0);
__decorate([
    TypeORM.Index(),
    TypeORM.Column({ nullable: true, type: "integer" }),
    __metadata("design:type", Number)
], Submission.prototype, "user_id", void 0);
__decorate([
    TypeORM.Column({ nullable: true, type: "integer" }),
    __metadata("design:type", Number)
], Submission.prototype, "submit_time", void 0);
Submission = __decorate([
    TypeORM.Entity()
], Submission);
exports.default = Submission;
//# sourceMappingURL=submission.js.map