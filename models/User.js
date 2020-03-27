class User {
  constructor(id, name, email, password, image, places) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.image = image;
    this.places = places;
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      image: this.image,
      places: this.places
    };
  }
}

module.exports = User;
