export function myConfetti(x, y) {

  var scalar = 1.2;

  confetti({
    shapes: ['square'],
    particleCount: 100,
    colors: ['8A2BE2', '32CD32', 'FF4500'],
    spread: 50,
    disableForReducedMotion: true,
    startVelocity: 50,
    ticks: 200,
    decay: 0.91,
    origin: { x: x, y: y },
    scalar
  });
}