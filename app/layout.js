import "./globals.css";
import { EVENT } from "../lib/config";

export const metadata = {
  title: `${EVENT.aniversariante} faz ${EVENT.idade}! ${EVENT.dataCurta}`,
  description:
    "Aniversário 25 anos + Chá de Panela — tema anos 2000. Confirme sua presença!",
  openGraph: {
    title: `${EVENT.aniversariante} faz ${EVENT.idade}! 🎉`,
    description:
      "Aniversário 25 anos + Chá de Panela — tema anos 2000. Confirme sua presença!",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#ff2d7e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Fredoka:wght@400;500;600;700&family=Micro+5&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%92%97%3C/text%3E%3C/svg%3E"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
