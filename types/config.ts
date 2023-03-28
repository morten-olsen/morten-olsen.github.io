interface Config {
  profile: {
    path: string;
  };
  frontpage: {
    react: {
      template: string;
    };
  };
  articles: {
    pattern: string;
    react: {
      template: string;
    };
    latex: {
      template: string;
    };
  };
  resume: {
    latex: {
      template: string;
    };
  };
  positions: {
    pattern: string;
  };
}

export { Config };
