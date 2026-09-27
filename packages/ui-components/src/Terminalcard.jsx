import React from 'react'

const TerminalCard = ({
  title,
  prompt = 'root@system:~#',
  dots = true,
  footer,
  maxWidth,
  className = '',
  style,
  children,
}) => {
  return (
    <div
      className={`terminal-frame terminal-card ${className}`}
      style={{
        '--term-card-max-width': maxWidth ? `${maxWidth}px` : undefined,
        ...style,
      }}
    >
      <span className="terminal-frame__corner terminal-frame__corner--tl" />
      <span className="terminal-frame__corner terminal-frame__corner--tr" />
      <span className="terminal-frame__corner terminal-frame__corner--bl" />
      <span className="terminal-frame__corner terminal-frame__corner--br" />
      <span className="terminal-frame__scanlines" />
      <span className="terminal-frame__beam" />

      <div className="terminal-frame__header">
        <span className="terminal-frame__prompt">
          {prompt}
          <span className="terminal-frame__cursor">█</span>
        </span>

        <div className="terminal-frame__title-group">
          {title && <span className="terminal-frame__title">{title}</span>}
          {dots && (
            <span className="terminal-frame__dots">
              <span />
              <span />
              <span />
            </span>
          )}
        </div>
      </div>

      <div className="terminal-frame__body">{children}</div>

      {footer && <div className="terminal-frame__footer">{footer}</div>}
    </div>
  )
}

export default TerminalCard
