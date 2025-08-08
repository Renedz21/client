import UploadFile from "./components/upload-file";
import ImageCard from "./components/image-card.tsx";

const App = () => {
  return (
    <section className="min-h-dvh w-full overflow-x-hidden px-4 py-6 md:px-6">
      <div className="mx-auto w-full max-w-screen-lg">
        <h1 className="mb-4 text-center text-xl font-bold sm:text-2xl">
          Sube tus imagenes
        </h1>
        <UploadFile />
      </div>

      <div className="mx-auto mt-8 w-full max-w-screen-2xl">
        <h2 className="mb-4 text-center text-lg font-semibold sm:text-xl">
          Imágenes subidas
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ImageCard />
        </div>
      </div>
    </section>
  );
};

export default App;
