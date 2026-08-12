function App() {
  return (
    <div className="min-h-screen bg-gray-200">
      
      {/* Toolbar */}
      <div className="h-16 bg-white border-b flex items-center px-5">
        <h1 className="text-xl font-bold">
          My Editor
        </h1>
      </div>

      {/* Workspace */}
      <div className="min-h-[calc(100vh-64px)] flex justify-center items-start p-10">
        
        {/* Kertas */}
        <div className="w-[794px] h-[1123px] bg-white shadow-lg">
          
        </div>

      </div>

    </div>
  );
}

export default App;