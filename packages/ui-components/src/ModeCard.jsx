import { Card } from "antd";

export default function ModeCard({
  title,
  extra,
  styles = {},
  children,
  ...restProps
}) {
  const defaultStyles = {
    header: {
      background: "#0f2a44",
      color: "#ffffff",
      height: "4rem",
      borderBottom: "1px solid #e5e7eb",
      padding: "12px 16px",
    },
    body: {
      background: "#ffffff",
      padding: "16px",
    },
    actions: {
      padding: "8px 16px",
      borderTop: "1px solid #f0f0f0",
    },
  };

  const mergedStyles = {
    header: {
      ...defaultStyles.header,
      ...styles.header,
    },
    body: {
      ...defaultStyles.body,
      ...styles.body,
    },
    actions: {
      ...defaultStyles.actions,
      ...styles.actions,
    },
  };

  return (
    <Card title={title} extra={extra} styles={mergedStyles} {...restProps}>
      {children}
    </Card>
  );
}
