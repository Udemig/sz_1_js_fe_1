import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutContext from "./context/layout-context";

/* Bazı componentlerin kullanıcıya hemen gösterilmesi gerekmeyebilir.
Örneğin kullanıcı anasayfadayken chat sayfasının hemen yüklenmesi
gerekmez çünkü kullanıcı henüz chat sayfasını açmak istememiştir.
Chat linkine tıkladığında react-router-dom kütüphanesi artık bu
sayfaya ihtiyaç duyar. Dolayısıyla bunu sadece ihtiyaç olduğunda
sunucudan almasını sağlamak için `lazy()` fonksiyonunu kullanmalıyız.
Bu yöntemin ismine "lazy loading" denir.

Fakat lazy() fonksiyonundan gelen componentler doğrudan kullanılamazlar.
Çünkü componentin sunucudan çekilmesi için geçen süre içerisinde
react hata vermesin diye bir loading ekranı göstermek gerekir.
Tüm bu süreçleri yöneten bir component vardır, bu componentin adı
`Suspense` componentidir. Bunun kullanım örneği aşağıdadır.
*/
const HomePage = lazy(() => import("./pages/home-page"));
const ChatPage = lazy(() => import("./pages/chat-page"));

const LoginPage = lazy(() => import("./pages/auth/login-page"));
const RegisterPage = lazy(() => import("./pages/auth/register-page"));

function App() {
  return (
    <BrowserRouter>
      <LayoutContext>
        <Routes>
          <Route
            index
            element={
              /* Suspense componentinin çalışma mantığı şu şekildedir:
              Child'da bir lazy loadable component olmalı, fallback
              property'sinde ise preloaded bir component olmalı. Lazy'den
              gelen component yüklenene kadar fallback'te belirtilen
              component gösterilir. Lazy'den component alındığında
              (veya başka bir deyişle sunucudan gerekli javascript
              dosyası çekildiğinde) fallback componentini kaldırıp
              yerine gelen componenti gösterir. */
              <Suspense fallback={<>Loading...</>}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="chat"
            element={
              <Suspense fallback={<>Loading...</>}>
                <ChatPage />
              </Suspense>
            }
          />

          <Route path="auth">
            <Route
              path="login"
              element={
                <Suspense fallback={<>Loading...</>}>
                  <LoginPage />
                </Suspense>
              }
            />
            <Route
              path="register"
              element={
                <Suspense fallback={<>Loading...</>}>
                  <RegisterPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </LayoutContext>
    </BrowserRouter>
  );
}

export default App;
