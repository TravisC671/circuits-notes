import React, { useState, useEffect } from "react";

function ConsoleDisplay() {
  const [logs, setLogs] = useState<string[]>([]);
  useEffect(() => {
    const originalConsoleLog = console.log;

    console.log = (...args) => {
      originalConsoleLog(...args); // Still log to the actual console
      setLogs((prevLogs) => [
        ...prevLogs,
        args.map((arg) => String(arg)).join(" "),
      ]); // Add to component state
    };

    return () => {
      console.log = originalConsoleLog; // Restore original console.log on unmount
    };
  }, []);
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        height: "200px",
        overflowY: "scroll",
        backgroundColor: "var(--color-base-200)",
      }}
    >
      <h3>Console Output:</h3>
      {logs.map((log, index) => (
        <p key={index} style={{ margin: "0", fontFamily: "monospace" }}>
          {log}
        </p>
      ))}
    </div>
  );
}

export default ConsoleDisplay;
