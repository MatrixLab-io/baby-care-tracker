const ProgressBar = ({ completed, total, percentage }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium text-ink-2">
          {completed} of {total} vaccines completed
        </span>
        <span className="text-[17px] font-bold text-ink tabular-nums">{percentage}%</span>
      </div>
      <div
        className="meter"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Vaccine progress"
      >
        <div className="meter-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
