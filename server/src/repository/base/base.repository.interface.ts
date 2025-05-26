interface IBaseRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(entity: T): Promise<T>;
    update(id: string, item: Partial<T>): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}

export { IBaseRepository };
