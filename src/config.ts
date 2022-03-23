class Config {
  public get dev() {
    return process && process.env.NODE_ENV === 'development';
  }
}

export const config = new Config();
