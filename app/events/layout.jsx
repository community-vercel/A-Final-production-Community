import { Inter } from "next/font/google";
import "../globals.css";
import Main from "@/components/Main";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body className={`${inter.className}  h-screen bg-[#F1F3F6]`}>


        <Main>
          {children}
        </Main>
      </body>
    </html>
  );
}
