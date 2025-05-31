import { type ReactNode } from "react";

type ShopProps = {
  children: ReactNode;
};

export default function Shop({ children }: ShopProps) {
  return (
    <section id="shop">
      <ul id="products">{children}</ul>
    </section>
  );
}
