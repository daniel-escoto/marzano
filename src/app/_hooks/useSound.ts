import { useCallback, useRef } from "react";

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback(() => {
    // Create AudioContext on first play (to comply with browser autoplay policies)
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const context = audioContextRef.current;

    // Create an oscillator for a simple "ding" sound
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Set up sound parameters
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(800, context.currentTime); // frequency in hertz

    // Set up envelope
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

    // Play sound
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);
  }, []);

  return { playSound };
}
