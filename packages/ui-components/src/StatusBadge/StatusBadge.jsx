export function StatusBadge({ label, status }) {
  const isUp = status === "connected";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: 600,
        background: isUp ? "#dcfce7" : "#fee2e2",
        color: isUp ? "#166534" : "#991b1b",
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: isUp ? "#22c55e" : "#ef4444",
        }}
      />
      {label}: {status}
    </span>
  );
}
