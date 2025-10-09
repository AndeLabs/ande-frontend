import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StakingSection } from '../staking/StakingSection';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

// Mock wagmi hooks
jest.mock('wagmi');

const mockUseAccount = useAccount as jest.MockedFunction<typeof useAccount>;
const mockUseReadContract = useReadContract as jest.MockedFunction<typeof useReadContract>;
const mockUseWriteContract = useWriteContract as jest.MockedFunction<typeof useWriteContract>;
const mockUseWaitForTransactionReceipt = useWaitForTransactionReceipt as jest.MockedFunction<typeof useWaitForTransactionReceipt>;

describe('StakingSection', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890' as `0x${string}`;
  const mockWriteContract = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock for useAccount
    mockUseAccount.mockReturnValue({
      address: mockAddress,
      isConnected: true,
    } as any);

    // Default mock for useWriteContract
    mockUseWriteContract.mockReturnValue({
      writeContract: mockWriteContract,
      data: undefined,
      isPending: false,
      isSuccess: false,
      error: null,
    } as any);

    // Default mock for useWaitForTransactionReceipt
    mockUseWaitForTransactionReceipt.mockReturnValue({
      isLoading: false,
      isSuccess: false,
    } as any);
  });

  describe('Wallet Connection', () => {
    it('should show connection prompt when wallet not connected', () => {
      mockUseAccount.mockReturnValue({
        address: undefined,
        isConnected: false,
      } as any);

      render(<StakingSection />);

      expect(screen.getByText(/conecta tu billetera/i)).toBeInTheDocument();
    });

    it('should show staking interface when wallet is connected', () => {
      mockUseReadContract.mockReturnValue({ data: BigInt(0) } as any);

      render(<StakingSection />);

      expect(screen.getByText(/veANDE Staking/i)).toBeInTheDocument();
      expect(screen.getByText(/Gestionar Staking/i)).toBeInTheDocument();
    });
  });

  describe('Stats Display', () => {
    beforeEach(() => {
      let callCount = 0;
      mockUseReadContract.mockImplementation(() => {
        const responses = [
          { data: BigInt(1000000000000000000) }, // andeBalance: 1 ANDE
          { data: BigInt(500000000000000000) },  // allowance: 0.5 ANDE
          { data: [BigInt(500000000000000000), BigInt(Math.floor(Date.now() / 1000) + 86400 * 365)] }, // locked: 0.5 ANDE for 1 year
          { data: BigInt(375000000000000000) },  // votingPower: 0.375 veANDE
          { data: BigInt(375000000000000000) },  // currentVotes: 0.375
        ];
        return responses[callCount++] as any;
      });
    });

    it('should display ANDE balance correctly', () => {
      render(<StakingSection />);

      expect(screen.getByText(/Balance ANDE/i)).toBeInTheDocument();
      // Balance is displayed - checking for the card
      const balanceCards = screen.getAllByText(/1\.0/);
      expect(balanceCards.length).toBeGreaterThan(0);
    });

    it('should display locked ANDE amount', () => {
      render(<StakingSection />);

      expect(screen.getByText(/ANDE Bloqueado/i)).toBeInTheDocument();
      const lockedCards = screen.getAllByText(/0\.5/);
      expect(lockedCards.length).toBeGreaterThan(0);
    });

    it('should display current voting power', () => {
      render(<StakingSection />);

      expect(screen.getByText(/Poder de Voto Actual/i)).toBeInTheDocument();
      const votingPowerCards = screen.getAllByText(/0\.375/);
      expect(votingPowerCards.length).toBeGreaterThan(0);
    });

    it('should display time remaining for lock', () => {
      render(<StakingSection />);

      expect(screen.getByText(/Tiempo Restante/i)).toBeInTheDocument();
      // Should show approximately 1 year (365 days)
      expect(screen.getByText(/1 año/)).toBeInTheDocument();
    });

    it('should show "Desbloqueado" when lock has expired', () => {
      let callCount = 0;
      mockUseReadContract.mockImplementation(() => {
        const responses = [
          { data: BigInt(1000000000000000000) },
          { data: BigInt(500000000000000000) },
          { data: [BigInt(500000000000000000), BigInt(Math.floor(Date.now() / 1000) - 86400)] }, // expired yesterday
          { data: BigInt(0) },
          { data: BigInt(0) },
        ];
        return responses[callCount++] as any;
      });

      render(<StakingSection />);

      expect(screen.getByText(/Desbloqueado/i)).toBeInTheDocument();
    });
  });

  describe('Voting Power Progress', () => {
    beforeEach(() => {
      let callCount = 0;
      mockUseReadContract.mockImplementation(() => {
        const responses = [
          { data: BigInt(1000000000000000000) },
          { data: BigInt(0) },
          { data: [BigInt(1000000000000000000), BigInt(Math.floor(Date.now() / 1000) + 86400 * 730)] }, // 2 years
          { data: BigInt(500000000000000000) }, // 50% voting power (2 years / 4 years)
          { data: BigInt(500000000000000000) },
        ];
        return responses[callCount++] as any;
      });
    });

    it('should display voting power decay progress bar', () => {
      render(<StakingSection />);

      expect(screen.getByText(/Decaimiento del Poder de Voto/i)).toBeInTheDocument();
      expect(screen.getByText(/decae linealmente/i)).toBeInTheDocument();
    });

    it('should show correct percentage of voting power remaining', () => {
      render(<StakingSection />);

      // Should show approximately 50%
      expect(screen.getByText(/50\.00%/)).toBeInTheDocument();
    });
  });

  describe('Create Lock Tab', () => {
    beforeEach(() => {
      mockUseReadContract.mockReturnValue({ data: BigInt(1000000000000000000) } as any);
    });

    it('should display create lock form', () => {
      render(<StakingSection />);

      expect(screen.getByText(/Crear Lock/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/0\.0/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/365/i)).toBeInTheDocument();
    });

    it('should allow user to input lock amount', () => {
      render(<StakingSection />);

      const amountInput = screen.getByPlaceholderText(/0\.0/i);
      fireEvent.change(amountInput, { target: { value: '100' } });

      expect(amountInput).toHaveValue(100);
    });

    it('should allow user to input lock days', () => {
      render(<StakingSection />);

      const daysInput = screen.getByPlaceholderText(/365/i);
      fireEvent.change(daysInput, { target: { value: '730' } });

      expect(daysInput).toHaveValue(730);
    });

    it('should show estimated voting power when amount and days are entered', () => {
      render(<StakingSection />);

      const amountInput = screen.getByPlaceholderText(/0\.0/i);
      const daysInput = screen.getByPlaceholderText(/365/i);

      fireEvent.change(amountInput, { target: { value: '100' } });
      fireEvent.change(daysInput, { target: { value: '730' } }); // 2 years = 50% voting power

      expect(screen.getByText(/Poder de voto estimado/i)).toBeInTheDocument();
      expect(screen.getByText(/50\.0 veANDE/)).toBeInTheDocument();
    });

    it('should show unlock date estimate', () => {
      render(<StakingSection />);

      const amountInput = screen.getByPlaceholderText(/0\.0/i);
      const daysInput = screen.getByPlaceholderText(/365/i);

      fireEvent.change(amountInput, { target: { value: '100' } });
      fireEvent.change(daysInput, { target: { value: '365' } });

      expect(screen.getByText(/Fecha de desbloqueo/i)).toBeInTheDocument();
    });

    it('should show approve button when allowance is insufficient', () => {
      mockUseReadContract.mockImplementation(({ functionName }) => {
        if (functionName === 'allowance') {
          return { data: BigInt(0) } as any;
        }
        return { data: BigInt(1000000000000000000) } as any;
      });

      render(<StakingSection />);

      const amountInput = screen.getByPlaceholderText(/0\.0/i);
      fireEvent.change(amountInput, { target: { value: '100' } });

      expect(screen.getByRole('button', { name: /Aprobar ANDE/i })).toBeInTheDocument();
    });

    it('should call approve function when approve button is clicked', () => {
      mockUseReadContract.mockImplementation(({ functionName }) => {
        if (functionName === 'allowance') {
          return { data: BigInt(0) } as any;
        }
        return { data: BigInt(1000000000000000000) } as any;
      });

      render(<StakingSection />);

      const amountInput = screen.getByPlaceholderText(/0\.0/i);
      fireEvent.change(amountInput, { target: { value: '100' } });

      const approveButton = screen.getByRole('button', { name: /Aprobar ANDE/i });
      fireEvent.click(approveButton);

      expect(mockWriteContract).toHaveBeenCalledWith(
        expect.objectContaining({
          functionName: 'approve',
        })
      );
    });

    it('should show create lock button when allowance is sufficient', () => {
      mockUseReadContract.mockImplementation(({ functionName }) => {
        if (functionName === 'allowance') {
          return { data: BigInt(1000000000000000000000) } as any; // Large allowance
        }
        return { data: BigInt(1000000000000000000) } as any;
      });

      render(<StakingSection />);

      const amountInput = screen.getByPlaceholderText(/0\.0/i);
      const daysInput = screen.getByPlaceholderText(/365/i);

      fireEvent.change(amountInput, { target: { value: '100' } });
      fireEvent.change(daysInput, { target: { value: '365' } });

      expect(screen.getByRole('button', { name: /Crear Lock/i })).toBeInTheDocument();
    });

    it('should call createLock function when create lock button is clicked', () => {
      mockUseReadContract.mockImplementation(({ functionName }) => {
        if (functionName === 'allowance') {
          return { data: BigInt(1000000000000000000000) } as any;
        }
        return { data: BigInt(1000000000000000000) } as any;
      });

      render(<StakingSection />);

      const amountInput = screen.getByPlaceholderText(/0\.0/i);
      const daysInput = screen.getByPlaceholderText(/365/i);

      fireEvent.change(amountInput, { target: { value: '100' } });
      fireEvent.change(daysInput, { target: { value: '365' } });

      const lockButton = screen.getByRole('button', { name: /Crear Lock/i });
      fireEvent.click(lockButton);

      expect(mockWriteContract).toHaveBeenCalledWith(
        expect.objectContaining({
          functionName: 'createLock',
        })
      );
    });
  });

  describe('Increase Lock Tab', () => {
    beforeEach(() => {
      let callCount = 0;
      mockUseReadContract.mockImplementation(() => {
        const responses = [
          { data: BigInt(1000000000000000000) },
          { data: BigInt(1000000000000000000000) },
          { data: [BigInt(500000000000000000), BigInt(Math.floor(Date.now() / 1000) + 86400 * 365)] },
          { data: BigInt(375000000000000000) },
          { data: BigInt(375000000000000000) },
        ];
        return responses[callCount++] as any;
      });
    });

    it('should disable increase tab when no lock exists', () => {
      mockUseReadContract.mockReturnValue({ data: [BigInt(0), BigInt(0)] } as any);

      render(<StakingSection />);

      const increaseTab = screen.getByRole('tab', { name: /Aumentar/i });
      expect(increaseTab).toBeDisabled();
    });

    it('should enable increase tab when lock exists', () => {
      render(<StakingSection />);

      const increaseTab = screen.getByRole('tab', { name: /Aumentar/i });
      expect(increaseTab).not.toBeDisabled();
    });

    it('should allow increasing lock amount', () => {
      render(<StakingSection />);

      const increaseTab = screen.getByRole('tab', { name: /Aumentar/i });
      fireEvent.click(increaseTab);

      expect(screen.getByText(/Añade más tokens ANDE/i)).toBeInTheDocument();
    });
  });

  describe('Extend Lock Tab', () => {
    beforeEach(() => {
      let callCount = 0;
      mockUseReadContract.mockImplementation(() => {
        const responses = [
          { data: BigInt(1000000000000000000) },
          { data: BigInt(1000000000000000000000) },
          { data: [BigInt(500000000000000000), BigInt(Math.floor(Date.now() / 1000) + 86400 * 365)] },
          { data: BigInt(375000000000000000) },
          { data: BigInt(375000000000000000) },
        ];
        return responses[callCount++] as any;
      });
    });

    it('should disable extend tab when no lock exists', () => {
      mockUseReadContract.mockReturnValue({ data: [BigInt(0), BigInt(0)] } as any);

      render(<StakingSection />);

      const extendTab = screen.getByRole('tab', { name: /Extender/i });
      expect(extendTab).toBeDisabled();
    });

    it('should enable extend tab when lock exists', () => {
      render(<StakingSection />);

      const extendTab = screen.getByRole('tab', { name: /Extender/i });
      expect(extendTab).not.toBeDisabled();
    });

    it('should allow extending lock duration', () => {
      render(<StakingSection />);

      const extendTab = screen.getByRole('tab', { name: /Extender/i });
      fireEvent.click(extendTab);

      expect(screen.getByText(/Extiende el tiempo de bloqueo/i)).toBeInTheDocument();
    });
  });

  describe('Withdraw Tab', () => {
    it('should disable withdraw tab when lock is not expired', () => {
      let callCount = 0;
      mockUseReadContract.mockImplementation(() => {
        const responses = [
          { data: BigInt(1000000000000000000) },
          { data: BigInt(0) },
          { data: [BigInt(500000000000000000), BigInt(Math.floor(Date.now() / 1000) + 86400 * 365)] },
          { data: BigInt(375000000000000000) },
          { data: BigInt(375000000000000000) },
        ];
        return responses[callCount++] as any;
      });

      render(<StakingSection />);

      const withdrawTab = screen.getByRole('tab', { name: /Retirar/i });
      expect(withdrawTab).toBeDisabled();
    });

    it('should enable withdraw tab when lock has expired', () => {
      let callCount = 0;
      mockUseReadContract.mockImplementation(() => {
        const responses = [
          { data: BigInt(1000000000000000000) },
          { data: BigInt(0) },
          { data: [BigInt(500000000000000000), BigInt(Math.floor(Date.now() / 1000) - 86400)] }, // expired
          { data: BigInt(0) },
          { data: BigInt(0) },
        ];
        return responses[callCount++] as any;
      });

      render(<StakingSection />);

      const withdrawTab = screen.getByRole('tab', { name: /Retirar/i });
      expect(withdrawTab).not.toBeDisabled();
    });

    it('should show success message when lock is expired', () => {
      let callCount = 0;
      mockUseReadContract.mockImplementation(() => {
        const responses = [
          { data: BigInt(1000000000000000000) },
          { data: BigInt(0) },
          { data: [BigInt(500000000000000000), BigInt(Math.floor(Date.now() / 1000) - 86400)] },
          { data: BigInt(0) },
          { data: BigInt(0) },
        ];
        return responses[callCount++] as any;
      });

      render(<StakingSection />);

      const withdrawTab = screen.getByRole('tab', { name: /Retirar/i });
      fireEvent.click(withdrawTab);

      expect(screen.getByText(/ha expirado/i)).toBeInTheDocument();
    });

    it('should call withdraw function when withdraw button is clicked', () => {
      let callCount = 0;
      mockUseReadContract.mockImplementation(() => {
        const responses = [
          { data: BigInt(1000000000000000000) },
          { data: BigInt(0) },
          { data: [BigInt(500000000000000000), BigInt(Math.floor(Date.now() / 1000) - 86400)] },
          { data: BigInt(0) },
          { data: BigInt(0) },
        ];
        return responses[callCount++] as any;
      });

      render(<StakingSection />);

      const withdrawTab = screen.getByRole('tab', { name: /Retirar/i });
      fireEvent.click(withdrawTab);

      const withdrawButton = screen.getByRole('button', { name: /Retirar 0\.5 ANDE/i });
      fireEvent.click(withdrawButton);

      expect(mockWriteContract).toHaveBeenCalledWith(
        expect.objectContaining({
          functionName: 'withdraw',
        })
      );
    });
  });

  describe('Transaction Status', () => {
    it('should show transaction link after approval', () => {
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: '0xabcd1234' as `0x${string}`,
        isPending: false,
        isSuccess: true,
        error: null,
      } as any);

      mockUseWaitForTransactionReceipt.mockReturnValue({
        isLoading: false,
        isSuccess: true,
      } as any);

      mockUseReadContract.mockReturnValue({ data: BigInt(0) } as any);

      render(<StakingSection />);

      expect(screen.getByText(/Ver en Blockscout/i)).toBeInTheDocument();
    });

    it('should show success message when transaction is confirmed', () => {
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: '0xabcd1234' as `0x${string}`,
        isPending: false,
        isSuccess: true,
        error: null,
      } as any);

      mockUseWaitForTransactionReceipt.mockReturnValue({
        isLoading: false,
        isSuccess: true,
      } as any);

      mockUseReadContract.mockReturnValue({ data: BigInt(0) } as any);

      render(<StakingSection />);

      expect(screen.getByText(/✅ Aprobación exitosa/i)).toBeInTheDocument();
    });
  });
});
