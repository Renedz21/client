import UploadFile from "./components/upload-file";
import ImageCard from "./components/image-card.tsx";

const App = () => {
  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-center mb-4">Sube tus imagenes</h1>
      <div className="w-full max-w-screen-lg">
        <UploadFile />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-center mb-4">
          Imágenes subidas
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <ImageCard />
        </div>
      </div>
    </section>
  );
};

export default App;
