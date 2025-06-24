import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
type WarningProps = {
  description: string;
  level: string;
  onClose: () => void;
};

export function WarningMessage({ description, level, onClose }: WarningProps) {
  const [progress, setProgress] = useState(100);
  useEffect(() => {
    setProgress(100); 
    const interval = 10;
    const increment = (100 / 4000) * interval;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [description, level]);

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose, description, level]);

  return createPortal(
    <div className="warning" onClick={onClose}>
      <dialog
        id="warning-modal"
        style={{ border: level === "height" ? "solid red" : "solid orange" }}
        open
      >
        <div className="main-warning">
          <h2 style={{ color: level === "height" ? "#FF0000" : "#FF8000" }}>
            Warning
          </h2>
          <p>{description}</p>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
              backgroundColor: level === "height" ? "#FF0000" : "#FF8000",
            }}
          ></div>
        </div>
      </dialog>
    </div>,
    document.getElementById("modal")!
  );
}
