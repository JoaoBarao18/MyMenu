
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { ScreenOrientation } from '@capacitor/screen-orientation';

const startApp = async () => {
  try {
    await ScreenOrientation.lock({ orientation: 'portrait' });
  } catch (err) {
    console.log('Screen orientation lock não disponível no browser.');
  }
  createRoot(document.getElementById("root")!).render(<App />);
};

startApp();
  