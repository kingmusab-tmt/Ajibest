import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/generalcomponents/authprovider";
import Layout from "./components/layout";
import { Providers } from "./components/generalcomponents/themeprovider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "A.A Ajibest Land Vendors Ltd",
  description:
    "Estate Management Web Application created by Musab Mubaraq Mburaimoh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Layout>
            <AuthProvider>{children}</AuthProvider>
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
