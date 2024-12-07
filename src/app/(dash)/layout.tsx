import Sidebar from "@/components/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex">
          
          <Sidebar />
          
          <main className="flex-1 p-4 bg-gray-100">{children}</main>
        </div>
      </body>
    </html>
  );
}
