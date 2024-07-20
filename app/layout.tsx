import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/generalcomponents/authprovider";
import Layout from "./components/layout";

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
    <html lang="en">
      <body className={inter.className}>
        <Layout>
          <AuthProvider>{children}</AuthProvider>
        </Layout>
      </body>
    </html>
  );
}
