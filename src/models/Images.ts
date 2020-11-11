import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Pet from './Pet';

@Entity('Images_pet')
export default class FilesPets {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  path: string;

  @ManyToOne(() => Pet, pet => pet.images)
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;
}
