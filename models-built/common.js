"use strict";
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
class Model extends TypeORM.BaseEntity {
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({
                where: {
                    id: parseInt(id) || 0
                }
            });
        });
    }
    save() {
        const _super = Object.create(null, {
            save: { get: () => super.save }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.save.call(this);
            return this;
        });
    }
    static queryByOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createQueryBuilder().orderBy(order).getMany();
        });
    }
}
exports.default = Model;
//# sourceMappingURL=common.js.map