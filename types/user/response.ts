export interface UserSubRow {
  id: number;
  field: string;
  value: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
  credit?: number;
  subRows: UserSubRow[];
}
