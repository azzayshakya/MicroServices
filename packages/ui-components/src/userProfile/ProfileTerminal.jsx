import { DeleteOutlined, LaptopOutlined, LoadingOutlined, LogoutOutlined } from '@ant-design/icons'
import { logOutAllSession, logOutUser } from '@devStack/apiServices/accounts-auth-apis'
import { handleApiError } from '@devStack/apiServices/utils/handle-api-error'
import { clearUserSession } from '@devStack/store/userSlice'
import { redirectToLoginUtil } from '@devStack/utils/redirect-utils'
import { removeUserSessionLocally } from '@devStack/utils/user-session-utils'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const ProfileTerminal = ({ user }) => {
  const authenticUser = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  const [terminatingTarget, setTerminatingTarget] = useState(null) // 'single' | 'all' | null

  const handleLogout = async () => {
    if (terminatingTarget) return
    setTerminatingTarget('single')
    try {
      await logOutUser()
    } catch (error) {
      handleApiError(error)
    } finally {
      dispatch(clearUserSession())
      removeUserSessionLocally()
      redirectToLoginUtil()
    }
  }

  const handleLogoutAllSession = async () => {
    if (terminatingTarget) return
    setTerminatingTarget('all')
    try {
      await logOutAllSession()
    } catch (error) {
      handleApiError(error)
    } finally {
      dispatch(clearUserSession())
      removeUserSessionLocally()
      redirectToLoginUtil()
    }
  }

  const isLoggingOut = terminatingTarget === 'single'
  const isPurgingAll = terminatingTarget === 'all'
  const isBusy = Boolean(terminatingTarget)

  return (
    <div
      style={{
        width: 350,
        background: 'var(--color-secondary-light)',
        border: '1px solid var(--term-border)',
        borderRadius: 12,
        padding: 20,
        color: 'var(--color-secondary-hover)',
        fontFamily: 'var(--term-font)',
        boxShadow: '0 0 25px rgba(57,255,106,.15), inset 0 0 20px rgba(57,255,106,.05)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          color: 'var(--color-primary)',
          fontSize: 11,
          marginBottom: 5,
          letterSpacing: 1,
        }}
      >
        {'// SESSION_INFO'}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <img
          src={user?.avatar || '/images/global/my-profile.jpg'}
          alt=""
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            border: '2px solid var(--color-primary)',
            boxShadow: 'var(--color-glow)',
            objectFit: 'cover',
          }}
        />

        <div>
          <div
            style={{
              color: 'var(--color-primary)',
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {authenticUser?.name ?? 'NA'}
          </div>

          <div
            style={{
              color: 'var(--color-secondary)',
              fontSize: 12,
            }}
          >
            {authenticUser?.username ?? 'NA'}
          </div>

          <div
            style={{
              marginTop: 8,
              display: 'inline-block',
              padding: '4px 10px',
              border: '1px solid var(--term-border)',
              borderRadius: 6,
              color: 'var(--color-primary)',
              fontSize: 11,
            }}
          >
            {authenticUser?.role ?? 'NA'}
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid var(--term-border)',
          borderBottom: '1px solid var(--term-border)',
          padding: '18px 0',
          display: 'grid',
          rowGap: 9,
        }}
      >
        {[
          ['USERNAME', authenticUser?.username ?? 'NA'],
          ['DEVICE ID', authenticUser?.deviceId ?? 'NA'],
          ['ROLE', authenticUser?.role ?? 'NA'],
          ['IP ADDRESS', '192.168.1.101'],
          ['DEVICE', 'Chrome / Windows 11'],
          ['LAST LOGIN', '23 Jul 2026'],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                color: 'var(--color-secondary)',
                fontSize: 11,
              }}
            >
              {label}
            </span>

            <span
              style={{
                color: 'var(--color-primary)',
                fontSize: 11,
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          border: '1px solid var(--term-border)',
          borderRadius: 10,
          padding: '10px 15px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <LaptopOutlined
          style={{
            color: 'var(--color-primary)',
            fontSize: 20,
          }}
        />

        <div style={{ flex: 1 }}>
          <div
            style={{
              color: 'var(--color-primary)',
              fontWeight: 600,
            }}
          >
            THIS SESSION
          </div>

          <div
            style={{
              color: 'var(--color-secondary)',
              fontSize: 11,
            }}
          >
            Chrome / Windows 11
          </div>
        </div>

        <div
          style={{
            border: '1px solid var(--term-border)',
            color: 'var(--color-primary)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
          }}
        >
          ACTIVE
        </div>
      </div>

      {/* Action Buttons with Cyberpunk/Hacker Terminal Loaders */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 22,
        }}
      >
        <button
          type="button"
          disabled={isBusy}
          onClick={handleLogoutAllSession}
          style={{
            flex: 1,
            height: 40,
            background: isPurgingAll ? 'rgba(57,255,106,.1)' : 'transparent',
            border: '1px solid var(--term-border)',
            borderRadius: 8,
            color: 'var(--color-primary)',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isBusy ? 'not-allowed' : 'pointer',
            opacity: isBusy && !isPurgingAll ? 0.45 : 1,
            boxShadow: 'var(--color-glow)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.8,
            fontFamily: 'var(--term-font, monospace)',
            transition: 'all 0.2s ease',
          }}
        >
          {isPurgingAll ? (
            <>
              <LoadingOutlined style={{ fontSize: 13 }} />
              PURGING...
            </>
          ) : (
            <>
              <DeleteOutlined />
              CLEAR SESSION
            </>
          )}
        </button>

        <button
          type="button"
          disabled={isBusy}
          onClick={handleLogout}
          style={{
            flex: 1,
            height: 40,
            background: isLoggingOut ? 'rgba(255,77,79,.12)' : 'transparent',
            border: '1px solid rgba(255,77,79,.5)',
            borderRadius: 8,
            color: '#ff4d4f',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isBusy ? 'not-allowed' : 'pointer',
            opacity: isBusy && !isLoggingOut ? 0.45 : 1,
            boxShadow: '0 0 15px rgba(255,77,79,.15)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.8,
            fontFamily: 'var(--term-font, monospace)',
            transition: 'all 0.2s ease',
          }}
        >
          {isLoggingOut ? (
            <>
              <LoadingOutlined style={{ fontSize: 13 }} />
              KILL_SIG...
            </>
          ) : (
            <>
              <LogoutOutlined />
              LOGOUT
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 20,
          color: 'var(--color-primary)',
          opacity: 0.7,
          fontSize: 12,
          letterSpacing: 0.5,
        }}
      >
        {isBusy
          ? '> [SYS_SIGNAL]: TERMINATING SOCKETS...'
          : '> Stay curious. Stay sharp. Stay in control.'}
      </div>
    </div>
  )
}
