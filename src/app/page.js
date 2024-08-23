import ImageConverter from "./components/ImageConverter";
import VideoConverter from "./components/VideoConverter";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <ImageConverter />
      <VideoConverter />
    </div>
  );
}
