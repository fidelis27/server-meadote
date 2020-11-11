import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import Ong from './Ong';

@Entity('Image_ong')
export default class FileOng {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  path: string;

  @OneToOne(() => Ong, ong => ong.image) // specify inverse side as a second parameter
  @JoinColumn({ name: 'ong_id' })
  ong: Ong;
}
