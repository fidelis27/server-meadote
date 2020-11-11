import Pet from '../models/Pet';
import imagesView from './images_views';

export default {
  render(pet: Pet) {
    return {
      id: pet.id,
      name: pet.name,
      description: pet.description,
      images: imagesView.renderMany(pet.images),
      adopted: pet.adopted,
      breed: pet.breed,
      ong: pet.ong_id,
      ong_name: pet.ong.name,
      ong_description: pet.ong.description,
      ong_email: pet.ong.email,
    };
  },

  renderMany(pets: Pet[]) {
    return pets.map(pet => this.render(pet));
  },
};
