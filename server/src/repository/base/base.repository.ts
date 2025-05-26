import { IBaseRepository } from "./base.repository.interface";
import { Model } from "mongoose";

class BaseRepository<T> implements IBaseRepository<T> {
    constructor(protected model: Model<T>) {}

    async findAll(): Promise<T[]> {
        try {
            return await this.model.find().exec();
        } catch (error: unknown) {
            if (error instanceof Error)
                throw new Error(`Failed to retrieve entities: ${error.message}`);
            else throw new Error("Error occured");
        }
    }

    async findById(id: string): Promise<T | null> {
        try {
            return await this.model.findById(id).exec();
        } catch (error) {
            if (error instanceof Error)
                throw new Error(`Failed to find entity by ID: ${error.message}`);
            else throw new Error("Error occured");
        }
    }

    async create(entity: T): Promise<T> {
        try {
            const created = await this.model.create(entity);
            return created;
        } catch (error) {
            if (error instanceof Error)
                throw new Error(`Failed to create entity: ${error.message}`);
            else throw new Error("Error occured");
        }
    }

    async update(id: string, item: Partial<T>): Promise<boolean> {
        try {
            const result = await this.model.updateOne({ _id: id }, { $set: item }).exec();
            return result.modifiedCount > 0;
        } catch (error) {
            if (error instanceof Error)
                throw new Error(`Failed to update entity: ${error.message}`);
            else throw new Error("Error occured");
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await this.model.deleteOne({ _id: id }).exec();
            return result.deletedCount > 0;
        } catch (error) {
            if (error instanceof Error)
                throw new Error(`Failed to delete entity: ${error.message}`);
            else throw new Error("Error occured");
        }
    }
}

export { BaseRepository };
