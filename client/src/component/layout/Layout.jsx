import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="flex bg-[#FAFAFA] min-h-screen">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="p-8 flex-1">

          {children}

        </main>

      </div>

    </div>
  );
}

export default Layout;