export interface BaseQueryRepository<TViewModel> {
  getAll(): Promise<TViewModel[]>;

  getById(id: string): Promise<TViewModel | null>;
}
