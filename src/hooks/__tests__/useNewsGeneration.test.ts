import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNewsGeneration } from '../useNewsGeneration';

// Mock the toast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the API service
vi.mock('@/services/api', () => ({
  apiService: {
    fetchNews: vi.fn(),
    generateScript: vi.fn(),
    generateAudio: vi.fn(),
  },
}));

describe('useNewsGeneration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useNewsGeneration());
    
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(typeof result.current.generatePodcast).toBe('function');
  });

  it('should return null when no categories are selected', async () => {
    const { result } = renderHook(() => useNewsGeneration());
    
    const audioUrl = await act(async () => {
      return result.current.generatePodcast([], 'friendly', '');
    });
    
    expect(audioUrl).toBeNull();
  });

  it('should return null when Local News is selected but no query provided', async () => {
    const { result } = renderHook(() => useNewsGeneration());
    
    const audioUrl = await act(async () => {
      return result.current.generatePodcast(['Local News'], 'friendly', '');
    });
    
    expect(audioUrl).toBeNull();
  });
});
