import "./globals.css";

export const metadata = {
  title: "Convert any media easily with no ads - ConvertMax",
  description: "Convert images to different formats easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
