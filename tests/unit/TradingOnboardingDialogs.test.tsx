import type { ComponentProps } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TradingOnboardingDialogs from '@/app/[locale]/(platform)/_components/TradingOnboardingDialogs'

vi.mock('next-intl', () => ({
  useExtracted: () => (message: string) => message,
}))

vi.mock('@/app/[locale]/(platform)/_actions/deposit-wallet', () => ({
  checkUsernameAvailabilityAction: vi.fn(),
}))

vi.mock('@/app/[locale]/(platform)/_components/TradingDialogs', () => ({
  FundAccountDialog: ({ open }: { open: boolean }) => open ? <div data-testid="fund-account-dialog" /> : null,
}))

vi.mock('@/app/[locale]/(platform)/_components/WalletFlow', () => ({
  WalletFlow: () => null,
}))

vi.mock('@/components/AppLink', () => ({
  default: function MockAppLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>
  },
}))

vi.mock('@/hooks/useSiteIdentity', () => ({
  useSiteIdentity: () => ({ name: 'Kuest' }),
}))

type TradingOnboardingDialogsProps = ComponentProps<typeof TradingOnboardingDialogs>

function createProps(
  overrides: Partial<TradingOnboardingDialogsProps> = {},
): TradingOnboardingDialogsProps {
  return {
    activeModal: null,
    onModalOpenChange: vi.fn(),
    usernameDefaultValue: '',
    usernameError: null,
    isUsernameSubmitting: false,
    onUsernameSubmit: vi.fn(),
    emailDefaultValue: '',
    emailError: null,
    isEmailSubmitting: false,
    onEmailSubmit: vi.fn(),
    onEmailSkip: vi.fn(),
    enableTradingStep: 'idle',
    enableTradingError: null,
    onCreateDepositWallet: vi.fn(),
    onEnableTradingAuth: vi.fn(),
    hasDeployedDepositWallet: false,
    hasTradingAuth: false,
    hasTokenApprovals: false,
    approvalsStep: 'idle',
    tokenApprovalError: null,
    onApproveTokens: vi.fn(),
    autoRedeemStep: 'idle',
    autoRedeemError: null,
    onApproveAutoRedeem: vi.fn(),
    fundModalOpen: false,
    onFundOpenChange: vi.fn(),
    onFundDeposit: vi.fn(),
    depositModalOpen: false,
    onDepositOpenChange: vi.fn(),
    withdrawModalOpen: false,
    onWithdrawOpenChange: vi.fn(),
    user: null,
    meldUrl: null,
    ...overrides,
  }
}

describe('tradingOnboardingDialogs', () => {
  it('does not let the username step close from dialog dismissal controls', async () => {
    const user = userEvent.setup()
    const onModalOpenChange = vi.fn()

    render(
      <TradingOnboardingDialogs
        {...createProps({
          activeModal: 'username',
          onModalOpenChange,
        })}
      />,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(onModalOpenChange).not.toHaveBeenCalled()
  })

  it('keeps other onboarding dialogs dismissible', async () => {
    const user = userEvent.setup()
    const onModalOpenChange = vi.fn()

    render(
      <TradingOnboardingDialogs
        {...createProps({
          activeModal: 'email',
          onModalOpenChange,
        })}
      />,
    )

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(onModalOpenChange).toHaveBeenCalledWith('email', false)
    })
  })
})
