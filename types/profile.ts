type Profile = {
  name: string;
  about: string;
  tagline: string;
  imageUrl: string;
  imagePath: string;
  info: {
    name: string;
    value: string;
  }[];
  skills: {
    name: string;
    level: number;
  }[];
};

export { Profile };
