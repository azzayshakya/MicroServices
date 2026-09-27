import { Tag } from 'antd'

const DotIndicator = ({ color }) => (
  <span
    style={{
      display: 'inline-flex',
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      backgroundColor: color,
      marginRight: '5px',
      flexShrink: 0,
      boxShadow: `0 0 0 2px ${color}33`,
    }}
  />
)

export default function ReusableAntdTag({
  status = '',
  config = {},
  size = 'medium', // Can be => small , medium , large
  showDot = false,
  uppercase = false,
  bordered = true,
  style = {},
}) {
  const match = config[status] || {}
  const sizeMap = {
    small: '70px',
    medium: '100px',
    large: '200px',
  }
  const FinalColor = match.color ?? 'default'
  const FinalLabel = match.label ?? status
  const dotColor = match.dotColor ?? match.color ?? '#aaa'
  const textColor = match.textColor ?? undefined

  const sizeStyle = sizeMap[size] ?? '70px'

  const tagStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    border: bordered ? `1px solid ${FinalColor}` : 'none',
    textTransform: uppercase ? 'uppercase' : 'none',
    color: textColor,
    cursor: 'default',
    userSelect: 'none',
    minWidth: sizeStyle,
    borderRadius: '9px',
    padding: '5px 0px',
    ...style,
  }

  return (
    <Tag color={FinalColor} style={tagStyle} bordered={bordered}>
      {showDot && <DotIndicator color={dotColor} />}
      {FinalLabel}
    </Tag>
  )
}
