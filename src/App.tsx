import UploadFile from "./components/upload-file";

const App = () => {
  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-center mb-4">Sube tus imagenes</h1>
      <div className="w-full max-w-screen-lg">
        <UploadFile />
      </div>
    </section>
  );
};

export default App;
