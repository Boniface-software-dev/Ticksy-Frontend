import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { hideToast } from "../features/organizer/uiSlice";

export default function Toast() {
  const dispatch = useDispatch();
  const { show, type, message } = useSelector((state) => state.ui.toast);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, dispatch]);

  if (!show) return null;

  return (
    <div className={`fixed top-4 right-4 px-6 py-4 z-50 rounded shadow-lg text-white text-sm
      animate-fade-in transition-all duration-500 ease-in-out
      ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
}