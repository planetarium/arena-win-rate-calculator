import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="container max-w-xl mx-auto flex flex-col h-screen">
      <div className="w-full min-h-full flex flex-col text-neutral-50 font-sans">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
