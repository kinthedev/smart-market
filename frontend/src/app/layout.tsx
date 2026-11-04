import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Market | Sàn Thương Mại Điện Tử Thông Minh",
  description:
    "Smart Market & Trend Intelligence Hub - Nền tảng mua sắm và bắt kịp xu hướng sản phẩm thông minh.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />

      </head>
      <body className="font-sans antialiased text-foreground bg-background">
        {children}
      </body>
    </html>
  );
}

