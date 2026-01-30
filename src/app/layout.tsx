import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Wortise CMS",
  description: "Fullstack CMS Challenge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}