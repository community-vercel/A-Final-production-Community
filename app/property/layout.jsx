import { Inter } from "next/font/google";
import "../globals.css";
import Main from "@/components/Main";
// import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CategoryProvider } from "../context/CategoryContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body className={`${inter.className}  h-screen bg-[#F1F3F6]`}>
      <CategoryProvider>


        <Main>
          {children}
        </Main>
        </CategoryProvider>
      </body>
    </html>
  );
}