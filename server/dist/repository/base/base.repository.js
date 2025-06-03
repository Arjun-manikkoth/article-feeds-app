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
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.find().exec();
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Error(`Failed to retrieve entities: ${error.message}`);
                else
                    throw new Error("Error occured");
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findById(id).exec();
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Error(`Failed to find entity by ID: ${error.message}`);
                else
                    throw new Error("Error occured");
            }
        });
    }
    create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const created = yield this.model.create(entity);
                return created;
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Error(`Failed to create entity: ${error.message}`);
                else
                    throw new Error("Error occured");
            }
        });
    }
    update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.updateOne({ _id: id }, { $set: item }).exec();
                return result.modifiedCount > 0;
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Error(`Failed to update entity: ${error.message}`);
                else
                    throw new Error("Error occured");
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.deleteOne({ _id: id }).exec();
                return result.deletedCount > 0;
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Error(`Failed to delete entity: ${error.message}`);
                else
                    throw new Error("Error occured");
            }
        });
    }
}
exports.BaseRepository = BaseRepository;
