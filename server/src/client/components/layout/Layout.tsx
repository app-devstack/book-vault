import { Style } from 'hono/css';
import type { FC } from 'hono/jsx';

export const Layout: FC = (props) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="/favicon.ico" />
        <title>bv-server</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <Style />
      </head>
      <body>{props.children}</body>
    </html>
  );
};
