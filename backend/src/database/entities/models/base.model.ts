import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class BaseModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ default: null })
  created_at: Date;
}
