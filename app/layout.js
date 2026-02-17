import ClientLayout from "./ClientLayout";
import "../src/modern-normalize.css";
import "../src/index.css";

export const metadata = {
  title: 'EspacoGeek',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
