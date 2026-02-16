import { ToastContainer } from "react-toastify";
import { useTheme } from "@/shared/hooks/useTheme";

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      theme={theme}
    />
  );
}
