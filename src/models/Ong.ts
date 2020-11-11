import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Pet from './Pet';
import Image from './Image';

@Entity('ongs')
export default class Ongs {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  city: string;

  @Column()
  uf: string;

  @Column()
  description: string;

  // relacionamento com image
  @OneToOne(() => Image, image => image.ong) // specify inverse side as a second parameter
  image: Image;

  // relacionamento com PETS
  @OneToMany(() => Pet, pet => pet.ong, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'ong_id' })
  pets: Pet[];
}
