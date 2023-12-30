import { ReactNode } from "react";
import Footer from "../../footer";
import Header from "../../header";

export type AppLayoutPropsType = {
  children: ReactNode;
};

export default function AppLayout(props: AppLayoutPropsType) {
  return (
    <>
      <Header />
      <main>{props.children}</main>
      <Footer />
    </>
  );
}
