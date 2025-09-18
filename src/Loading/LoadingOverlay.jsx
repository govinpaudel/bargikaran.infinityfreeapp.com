const LoadingOverlay = ({ loading, message = "कृपया प्रतिक्षा गर्नुहोस्..." }) => {
  if (!loading) return null; // Don't render anything if not loading

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">कृपया प्रतिक्षा गर्नुहोस्...</span>
      </div>
      <p className="mt-3 fw-bold">{message}</p>
    </div>
  );
};

export default LoadingOverlay;
