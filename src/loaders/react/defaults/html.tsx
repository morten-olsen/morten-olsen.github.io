import { ReactNode } from "react";

type Props = {
  body: ReactNode;
  head: ReactNode;
}

const Html: React.FC<Props> = ({ body, head }) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {head}
        <title>React SSR</title>
      </head>
      <body>
        <div id="root">{body}</div>
      </body>
    </html>
  );
}

export { Html };
