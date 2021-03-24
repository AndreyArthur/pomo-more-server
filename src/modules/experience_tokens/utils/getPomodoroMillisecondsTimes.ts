export default function getPomodoroMillisecondsTimes(
  minutes: number,
): { workingTime: number, pauseTime: number } {
  const milliseconds = (minutes * 60) * 1000;

  const pauseTimeInMilliseconds = Math.round(
    (milliseconds * 16666666666) / 100000000000,
  );

  const workingTimeInMilliseconds = Math.round(
    milliseconds - pauseTimeInMilliseconds,
  );

  return {
    workingTime: workingTimeInMilliseconds,
    pauseTime: pauseTimeInMilliseconds,
  };
}
