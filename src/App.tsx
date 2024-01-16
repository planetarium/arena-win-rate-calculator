import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="container max-w-xl mx-auto flex flex-col h-screen">
      <div className="flex-1 w-full overflow-y-auto">
        <div className="w-full min-h-full flex flex-col mx-auto max-w-md font-sans py-2 px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;