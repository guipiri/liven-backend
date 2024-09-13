import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Address {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  alias: string;

  @ApiProperty()
  @Column()
  address: string;

  @ApiProperty()
  @Column({ type: 'bigint' })
  number: number;

  @ApiProperty()
  @Column()
  cep: string;

  @ApiProperty()
  @Column()
  city: string;

  @ApiProperty()
  @Column()
  state: string;

  @ApiProperty()
  @Column()
  country: string;

  @ApiProperty()
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;
}
