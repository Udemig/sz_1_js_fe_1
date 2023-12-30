import { ReactNode, createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "../../components/layouts/app-layout";
import AuthLayout from "../../components/layouts/auth-layout";

/* Normal şartlarda bir componentin parametresine bir değer
gönderilmeyecekse o componentin prop type'ını belirtme
zorunluluğu yoktur. Fakat bir componentin child veya
proplarına bir değer gönderilecekse mutlaka bunun type'ını
belirtmeliyiz. Aksi halde örneğin bir type belirtilmemişken
prop veya child gönderilirse typescript hata verir. Aynı şekilde
eğer type belirtilmiş ama type'ta belirtilen proplar veya children
değerleri verilmezse typescript yine hata verecektir. */
export type LayoutContextComponentPropsType = {
  /* `children` property'si React'la birlikte gelen predefined
  bir keyworddür. JSX componentinin içerisine başka bir JSX
  componenti eklendiğinde otomatik olarak bu property'ye gelir. */
  children: ReactNode;
};

/* createContext() fonksiyonunun tanımı gereği mutlaka
bir tür belirtmemiz gerekiyor. Bu yüzden herhangi bir data
tutmayacak olsak bile yine de içi boş bir obje türü tanımlıyoruz. */
export type LayoutContextType = {};

const LayoutContextProvider = createContext<LayoutContextType>({});

export default function LayoutContext(props: LayoutContextComponentPropsType) {
  /* URL değişimlerini alıyoruz. */
  let location = useLocation();
  const [isAuthUrl, setIsAuthUrl] = useState<boolean>(
    location.pathname.startsWith("/auth")
  );

  useEffect(() => {
    /* Her URL değiştiğinde mevcut URL'nin auth ile başlayıp
    başlamadığını tespit edip state'i güncelliyoruz. State
    güncellendiğinde bu component (LayoutContext) tekrar
    render edileceği için layout'u değiştirmemiz mümkün
    hale gelir. */

    console.log("Location changed: " + location.pathname);

    setIsAuthUrl(location.pathname.startsWith("/auth"));
  }, [location]);

  console.log(">> 🚀 file: index.tsx:27 🚀 isAuthUrl:", isAuthUrl);

  /* Şimdilik layout-context'in herhangi bir data tutmasına gerek yok. */
  const contextValue: LayoutContextType = {};

  /* Location değişimi isAuthUrl'yi değiştirir, eğer şuanki
  adres auth adresiyse o zaman bizim de layout'ları değiştirmemiz
  gerekir. Bu sayede login ekranlarıyla normal ekranların genel
  görünümünü uygun şekilde değiştirmiş oluruz. */
  const SelectedLayout = isAuthUrl ? AuthLayout : AppLayout;

  return (
    <LayoutContextProvider.Provider value={contextValue}>
      <SelectedLayout>{props.children}</SelectedLayout>
    </LayoutContextProvider.Provider>
  );
}
