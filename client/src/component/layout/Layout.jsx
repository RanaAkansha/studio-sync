import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="flex bg-[#FAFAFA] h-screen overflow-hidden">

      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        <Navbar />

        <main className="p-8 flex-1 overflow-y-auto">

          {children}

        </main>

      </div>

    </div>
  );
}

export default Layout;