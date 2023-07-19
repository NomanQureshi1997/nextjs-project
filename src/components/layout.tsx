import React, { ReactNode, Suspense } from "react";
import Navbar from "~/components/layout/navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* <Suspense fallback="...">
        <Navbar />
      </Suspense> */} {/* TODO add navbar back in */}
      {/* <main style={{ backgroundColor: "#F1F3F9" }} */}
      <main style={{ backgroundColor: "#FAFBFC" }}>
      {children}</main>
    </>
  );
};

export default Layout;
