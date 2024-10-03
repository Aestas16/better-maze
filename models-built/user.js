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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
const TypeORM = require("typeorm");
const common_1 = require("./common");
let User = User_1 = class User extends common_1.default {
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.findOne({
                where: { username: String(name) }
            });
        });
    }
};
__decorate([
    TypeORM.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    TypeORM.Index({ unique: true }),
    TypeORM.Column({ nullable: true, type: "varchar", length: 80 }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    TypeORM.Column({ nullable: true, type: "varchar", length: 120 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    TypeORM.Column({ nullable: true, type: "integer" }),
    __metadata("design:type", Number)
], User.prototype, "mazestep", void 0);
User = User_1 = __decorate([
    TypeORM.Entity()
], User);
exports.default = User;
//# sourceMappingURL=user.js.map