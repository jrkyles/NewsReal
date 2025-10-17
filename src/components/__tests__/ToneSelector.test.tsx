import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToneSelector } from '../ToneSelector';
import { TONE_OPTIONS } from '@/constants';

const mockProps = {
  selectedTone: 'friendly',
  onToneChange: vi.fn(),
};

describe('ToneSelector', () => {
  it('renders all tone options', () => {
    render(<ToneSelector {...mockProps} />);
    
    TONE_OPTIONS.forEach(tone => {
      expect(screen.getByText(tone.label)).toBeInTheDocument();
      expect(screen.getByText(tone.description)).toBeInTheDocument();
    });
  });

  it('highlights selected tone', () => {
    render(<ToneSelector {...mockProps} />);
    
    const friendlyTone = screen.getByText('Friendly').closest('div');
    expect(friendlyTone).toHaveClass('ring-2', 'ring-primary');
  });

  it('calls onToneChange when tone is clicked', () => {
    render(<ToneSelector {...mockProps} />);
    
    fireEvent.click(screen.getByText('Professional'));
    
    expect(mockProps.onToneChange).toHaveBeenCalledWith('professional');
  });
});
