import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Address } from '../../addresses/entities/address.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  password: string;

  @ApiProperty()
  @OneToMany(() => Address, (address) => address.user)
  addresses?: Address[];

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;
}
