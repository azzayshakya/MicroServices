import { Modal } from 'antd'

const TerminalModal = ({
  open = true,
  onClose,
  title,
  prompt = 'root@system:~#',
  dots = true,
  footer,
  width = 480,
  maskClosable = true,
  children,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      maskClosable={maskClosable}
      width={width}
      destroyOnClose
      rootClassName="terminal-modal"
    >
      <div className="terminal-frame terminal-modal__inner">
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
            <button type="button" className="terminal-frame__close" onClick={onClose}>
              ESC
            </button>
          </div>
        </div>

        <div className="terminal-frame__body">{children}</div>

        {footer && <div className="terminal-frame__footer">{footer}</div>}
      </div>
    </Modal>
  )
}

export default TerminalModal
