import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { GovernanceDAO } from '../GovernanceDAO';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

// Mock wagmi hooks
jest.mock('wagmi');

const mockUseAccount = useAccount as jest.MockedFunction<typeof useAccount>;
const mockUseReadContract = useReadContract as jest.MockedFunction<typeof useReadContract>;
const mockUseWriteContract = useWriteContract as jest.MockedFunction<typeof useWriteContract>;
const mockUseWaitForTransactionReceipt = useWaitForTransactionReceipt as jest.MockedFunction<typeof useWaitForTransactionReceipt>;

describe('GovernanceDAO', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890' as `0x${string}`;
  const mockWriteContract = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock for useAccount
    mockUseAccount.mockReturnValue({
      address: mockAddress,
      isConnected: true,
    } as any);

    // Default mock for useReadContract (voting power)
    mockUseReadContract.mockReturnValue({
      data: parseEther('100'),
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

      render(<GovernanceDAO />);

      expect(screen.getByText(/conecta tu billetera/i)).toBeInTheDocument();
    });

    it('should show governance interface when wallet is connected', () => {
      render(<GovernanceDAO />);

      expect(screen.getByText(/Gobernanza Descentralizada/i)).toBeInTheDocument();
      expect(screen.getByText(/Propuestas/i)).toBeInTheDocument();
    });
  });

  describe('Stats Display', () => {
    it('should display user voting power', () => {
      mockUseReadContract.mockReturnValue({
        data: parseEther('150.5'),
      } as any);

      render(<GovernanceDAO />);

      expect(screen.getByText(/Tu Poder de Voto/i)).toBeInTheDocument();
      expect(screen.getByText('150.5')).toBeInTheDocument();
      expect(screen.getByText('veANDE')).toBeInTheDocument();
    });

    it('should display zero voting power when user has no veANDE', () => {
      mockUseReadContract.mockReturnValue({
        data: undefined,
      } as any);

      render(<GovernanceDAO />);

      expect(screen.getByText('0.0')).toBeInTheDocument();
    });

    it('should display total proposals count', () => {
      render(<GovernanceDAO />);

      // Mock data has 3 proposals
      const totalCard = screen.getByText(/Total Propuestas/i).closest('div');
      expect(within(totalCard!).getByText('3')).toBeInTheDocument();
    });

    it('should display active proposals count', () => {
      render(<GovernanceDAO />);

      // Mock data has 2 active proposals
      const activeCard = screen.getByText(/^Activas$/i).closest('div');
      expect(within(activeCard!).getByText('2')).toBeInTheDocument();
    });

    it('should display passed proposals count', () => {
      render(<GovernanceDAO />);

      // Mock data has 1 passed proposal
      const passedCard = screen.getByText(/^Aprobadas$/i).closest('div');
      expect(within(passedCard!).getByText('1')).toBeInTheDocument();
    });

    it('should display rejected proposals count', () => {
      render(<GovernanceDAO />);

      // Mock data has 0 rejected proposals
      const rejectedCard = screen.getByText(/^Rechazadas$/i).closest('div');
      expect(within(rejectedCard!).getByText('0')).toBeInTheDocument();
    });
  });

  describe('Proposal Filtering', () => {
    it('should show active proposals by default', () => {
      render(<GovernanceDAO />);

      expect(screen.getByText(/Acuñar 100,000 ANDE/i)).toBeInTheDocument();
      expect(screen.getByText(/Reducir Ratio de Colateralización/i)).toBeInTheDocument();
      // Should not show passed proposals
      expect(screen.queryByText(/Implementar Nuevo Oracle/i)).not.toBeInTheDocument();
    });

    it('should show all proposals when "Todas" filter is selected', () => {
      render(<GovernanceDAO />);

      const allTab = screen.getByRole('tab', { name: /Todas/i });
      fireEvent.click(allTab);

      expect(screen.getByText(/Acuñar 100,000 ANDE/i)).toBeInTheDocument();
      expect(screen.getByText(/Reducir Ratio de Colateralización/i)).toBeInTheDocument();
      expect(screen.getByText(/Implementar Nuevo Oracle/i)).toBeInTheDocument();
    });

    it('should show only passed proposals when "Aprobadas" filter is selected', () => {
      render(<GovernanceDAO />);

      const passedTab = screen.getByRole('tab', { name: /Aprobadas/i });
      fireEvent.click(passedTab);

      expect(screen.getByText(/Implementar Nuevo Oracle/i)).toBeInTheDocument();
      expect(screen.queryByText(/Acuñar 100,000 ANDE/i)).not.toBeInTheDocument();
    });

    it('should show empty state when no proposals match filter', () => {
      render(<GovernanceDAO />);

      const rejectedTab = screen.getByRole('tab', { name: /Rechazadas/i });
      fireEvent.click(rejectedTab);

      expect(screen.getByText(/No hay propuestas en esta categoría/i)).toBeInTheDocument();
    });
  });

  describe('Proposal Cards', () => {
    it('should display proposal title and description', () => {
      render(<GovernanceDAO />);

      expect(screen.getByText(/Acuñar 100,000 ANDE para Desarrollo del Ecosistema/i)).toBeInTheDocument();
      expect(screen.getByText(/Propuesta para acuñar 100,000 tokens ANDE/i)).toBeInTheDocument();
    });

    it('should display proposal type badges', () => {
      render(<GovernanceDAO />);

      expect(screen.getByText(/Acuñación/i)).toBeInTheDocument();
      expect(screen.getByText(/Parámetro/i)).toBeInTheDocument();
    });

    it('should display proposal status badges', () => {
      render(<GovernanceDAO />);

      const activeBadges = screen.getAllByText(/Activa/i);
      expect(activeBadges.length).toBeGreaterThan(0);
    });

    it('should display time remaining for active proposals', () => {
      render(<GovernanceDAO />);

      expect(screen.getByText(/5 días restantes/i)).toBeInTheDocument();
    });

    it('should display voting results with percentages', () => {
      render(<GovernanceDAO />);

      // First proposal has 250k for vs 50k against (83.3% vs 16.7%)
      expect(screen.getByText(/83\.3%/i)).toBeInTheDocument();
      expect(screen.getByText(/16\.7%/i)).toBeInTheDocument();
    });

    it('should display quorum progress', () => {
      render(<GovernanceDAO />);

      // First proposal has 300k votes with 100k quorum (300%)
      expect(screen.getByText(/Quorum/i)).toBeInTheDocument();
      const quorumValues = screen.getAllByText(/300\.0%/i);
      expect(quorumValues.length).toBeGreaterThan(0);
    });

    it('should show vote counts in Ether format', () => {
      render(<GovernanceDAO />);

      expect(screen.getByText(/250000\.0 votos/i)).toBeInTheDocument();
      expect(screen.getByText(/50000\.0 votos/i)).toBeInTheDocument();
    });
  });

  describe('Voting Functionality', () => {
    it('should show voting buttons when user has voting power', () => {
      mockUseReadContract.mockReturnValue({
        data: parseEther('100'),
      } as any);

      render(<GovernanceDAO />);

      const favorButtons = screen.getAllByRole('button', { name: /A Favor/i });
      const contraButtons = screen.getAllByRole('button', { name: /En Contra/i });

      expect(favorButtons.length).toBeGreaterThan(0);
      expect(contraButtons.length).toBeGreaterThan(0);
    });

    it('should show alert when user has no voting power', () => {
      mockUseReadContract.mockReturnValue({
        data: BigInt(0),
      } as any);

      render(<GovernanceDAO />);

      expect(screen.getByText(/Necesitas veANDE/i)).toBeInTheDocument();
    });

    it('should call vote function when "A Favor" is clicked', () => {
      mockUseReadContract.mockReturnValue({
        data: parseEther('100'),
      } as any);

      render(<GovernanceDAO />);

      const favorButtons = screen.getAllByRole('button', { name: /A Favor/i });
      fireEvent.click(favorButtons[0]);

      expect(mockWriteContract).toHaveBeenCalledWith(
        expect.objectContaining({
          functionName: 'voteOnProposal',
          args: [BigInt(1), true],
        })
      );
    });

    it('should call vote function when "En Contra" is clicked', () => {
      mockUseReadContract.mockReturnValue({
        data: parseEther('100'),
      } as any);

      render(<GovernanceDAO />);

      const contraButtons = screen.getAllByRole('button', { name: /En Contra/i });
      fireEvent.click(contraButtons[0]);

      expect(mockWriteContract).toHaveBeenCalledWith(
        expect.objectContaining({
          functionName: 'voteOnProposal',
          args: [BigInt(1), false],
        })
      );
    });

    it('should disable voting buttons while transaction is pending', () => {
      mockUseReadContract.mockReturnValue({
        data: parseEther('100'),
      } as any);

      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: undefined,
        isPending: true,
        isSuccess: false,
        error: null,
      } as any);

      render(<GovernanceDAO />);

      const favorButtons = screen.getAllByRole('button', { name: /A Favor/i });
      expect(favorButtons[0]).toBeDisabled();
    });

    it('should show transaction status after voting', () => {
      mockUseReadContract.mockReturnValue({
        data: parseEther('100'),
      } as any);

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

      render(<GovernanceDAO />);

      const favorButtons = screen.getAllByRole('button', { name: /A Favor/i });
      fireEvent.click(favorButtons[0]);

      // Should show transaction link
      expect(screen.getByText(/Ver en Blockscout/i)).toBeInTheDocument();
    });

    it('should show success message when vote is confirmed', () => {
      mockUseReadContract.mockReturnValue({
        data: parseEther('100'),
      } as any);

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

      render(<GovernanceDAO />);

      const favorButtons = screen.getAllByRole('button', { name: /A Favor/i });
      fireEvent.click(favorButtons[0]);

      expect(screen.getByText(/✅ Voto registrado exitosamente/i)).toBeInTheDocument();
    });

    it('should show processing message while vote is pending', () => {
      mockUseReadContract.mockReturnValue({
        data: parseEther('100'),
      } as any);

      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: '0xabcd1234' as `0x${string}`,
        isPending: false,
        isSuccess: false,
        error: null,
      } as any);

      mockUseWaitForTransactionReceipt.mockReturnValue({
        isLoading: true,
        isSuccess: false,
      } as any);

      render(<GovernanceDAO />);

      const favorButtons = screen.getAllByRole('button', { name: /A Favor/i });
      fireEvent.click(favorButtons[0]);

      expect(screen.getByText(/⏳ Procesando voto\.\.\./i)).toBeInTheDocument();
    });
  });

  describe('Proposal Types', () => {
    it('should display mint proposal with correct icon', () => {
      render(<GovernanceDAO />);

      const allTab = screen.getByRole('tab', { name: /Todas/i });
      fireEvent.click(allTab);

      expect(screen.getByText(/Acuñación/i)).toBeInTheDocument();
    });

    it('should display parameter proposal with correct icon', () => {
      render(<GovernanceDAO />);

      expect(screen.getByText(/Parámetro/i)).toBeInTheDocument();
    });

    it('should display upgrade proposal with correct icon', () => {
      render(<GovernanceDAO />);

      const allTab = screen.getByRole('tab', { name: /Todas/i });
      fireEvent.click(allTab);

      expect(screen.getByText(/Actualización/i)).toBeInTheDocument();
    });
  });

  describe('Proposal Status', () => {
    it('should show active status badge for active proposals', () => {
      render(<GovernanceDAO />);

      const activeBadges = screen.getAllByText(/Activa/i);
      expect(activeBadges.length).toBe(2); // 2 active proposals
    });

    it('should show passed status badge for approved proposals', () => {
      render(<GovernanceDAO />);

      const allTab = screen.getByRole('tab', { name: /Todas/i });
      fireEvent.click(allTab);

      expect(screen.getByText(/Aprobada/i)).toBeInTheDocument();
    });

    it('should not show voting buttons for passed proposals', () => {
      render(<GovernanceDAO />);

      const passedTab = screen.getByRole('tab', { name: /Aprobadas/i });
      fireEvent.click(passedTab);

      const voteButtons = screen.queryAllByRole('button', { name: /A Favor/i });
      expect(voteButtons.length).toBe(0);
    });
  });

  describe('Create Proposal Section', () => {
    it('should show create proposal placeholder', () => {
      render(<GovernanceDAO />);

      expect(screen.getByText(/¿Tienes una idea\?/i)).toBeInTheDocument();
      expect(screen.getByText(/próximamente/i)).toBeInTheDocument();
    });

    it('should have disabled create proposal button', () => {
      render(<GovernanceDAO />);

      const createButton = screen.getByRole('button', { name: /Crear Propuesta/i });
      expect(createButton).toBeDisabled();
    });
  });

  describe('User Voting Power Display', () => {
    it('should show user voting power in proposal cards', () => {
      mockUseReadContract.mockReturnValue({
        data: parseEther('75.5'),
      } as any);

      render(<GovernanceDAO />);

      expect(screen.getByText(/Tu poder de voto: 75\.5 veANDE/i)).toBeInTheDocument();
    });
  });
});
