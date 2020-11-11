import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Images from './Images';
import Ong from './Ong';

@Entity('pets')
export default class Pets {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  adopted: boolean;

  @Column()
  breed: string;

  @Column()
  ong_id: string;

  @ManyToOne(() => Ong, ong => ong.pets)
  @JoinColumn({ name: 'ong_id' })
  ong: Ong;

  // ok
  @OneToMany(() => Images, image => image.pet, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'pet_id' })
  images: Images[];
}
