import { Roboto_Mono, Rubik } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Global Components/Navbar";
import Footer from "@/components/Global Components/Footer";

// Heading font
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

// Paragraph, Navbar, Button font
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata = {
  title: "CareBD | Community Social Development Platform",
  description: "Join and create social service events in your local area",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${robotoMono.variable} ${rubik.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-[#030215] text-white">
        <SmoothScroll>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}