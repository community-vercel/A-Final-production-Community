import { Inter } from "next/font/google";
import "../globals.css";
import AuthSlider from "@/components/AuthSlider";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sharpologicans",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        
      <div
          className={`bg-[url(../assets/login_bg.jpg)] lg:min-h-screen lg:min-w-[100vw] bg-cover bg-no-repeat flex flex-col-reverse lg:flex-row`}
        >
          <div className="flex flex-col justify-center flex-1 lg:flex-[35%]  flex-grow-0 bg-white md:min-h-screen rounded-tr-[32px] rounded-tl-[32px] lg:rounded-tl-[0px] lg:rounded-tr-[64px] lg:rounded-br-[64px] px-8 py-5">
            {children}
          </div>
          <div className="flex-1 lg:flex-[65%] flex-grow-0 py-8">
            <AuthSlider/>
          </div>
        </div>
        
      {/* <ToastContainer /> */}
      </body>
    </html>
  );
}
