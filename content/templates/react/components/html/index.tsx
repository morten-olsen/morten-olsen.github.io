import { FC, ReactNode } from 'react';

type HtmlProps = {
  body: ReactNode;
  head: ReactNode;
  scripts: string[];
};

const Html: FC<HtmlProps> = ({ body, head, scripts }) => {
  return (
    <html>
      <head>
        <title>My App</title>
        {head}
        {scripts.map((script, index) => (
          <script key={index} src={script} />
        ))}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Black+Ops+One&family=Merriweather:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="root">{body}</div>
      </body>
    </html>
  );
};

export { Html };
