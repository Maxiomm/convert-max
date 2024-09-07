import "./globals.css";

export const metadata = {
  title: "Convert any media easily with no ads and for free - ConvertMax",
  description:
    "Convert images, videos, audios and documents to different formats easily and for free",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
