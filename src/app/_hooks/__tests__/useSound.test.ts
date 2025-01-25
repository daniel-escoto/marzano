import { renderHook } from "@testing-library/react";
import { useSound } from "../useSound";

// Mock AudioContext and its methods
const mockConnect = jest.fn();
const mockStart = jest.fn();
const mockStop = jest.fn();
const mockCreateOscillator = jest.fn(() => ({
  connect: mockConnect,
  frequency: {
    setValueAtTime: jest.fn(),
  },
  type: "sine",
  start: mockStart,
  stop: mockStop,
}));
const mockCreateGain = jest.fn(() => ({
  connect: mockConnect,
  gain: {
    setValueAtTime: jest.fn(),
    linearRampToValueAtTime: jest.fn(),
    exponentialRampToValueAtTime: jest.fn(),
  },
}));

// Mock the AudioContext constructor
const mockAudioContext = jest.fn(() => ({
  createOscillator: mockCreateOscillator,
  createGain: mockCreateGain,
  currentTime: 0,
  destination: {},
}));

// @ts-expect-error -- AudioContext mock for testing
window.AudioContext = mockAudioContext;

describe("useSound", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create AudioContext only when playSound is called", () => {
    const { result } = renderHook(() => useSound());

    expect(AudioContext).not.toHaveBeenCalled();

    result.current.playSound();

    expect(AudioContext).toHaveBeenCalledTimes(1);
  });

  it("should reuse existing AudioContext on subsequent calls", () => {
    const { result } = renderHook(() => useSound());

    result.current.playSound();
    result.current.playSound();

    expect(AudioContext).toHaveBeenCalledTimes(1);
  });

  it("should set up oscillator and gain nodes correctly", () => {
    const { result } = renderHook(() => useSound());

    result.current.playSound();

    expect(mockCreateOscillator).toHaveBeenCalled();
    expect(mockCreateGain).toHaveBeenCalled();
    expect(mockConnect).toHaveBeenCalledTimes(2); // Once for oscillator->gain, once for gain->destination
    expect(mockStart).toHaveBeenCalled();
    expect(mockStop).toHaveBeenCalled();
  });
});
