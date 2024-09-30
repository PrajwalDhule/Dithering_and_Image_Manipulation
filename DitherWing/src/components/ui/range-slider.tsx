interface RangeSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChangeFn: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  title: string;
  showValue: number | string;
}

const RangeSlider = ({
  value,
  min,
  max,
  step,
  onChangeFn,
  id,
  title,
  showValue,
}: RangeSliderProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-3 text-sm font-medium ">
        <label htmlFor={id} className="text-text">
          {title}
        </label>
        <span id="no-of-colors-value" className="text-gray-400">
          {showValue}
        </span>
      </div>
      <input
        value={value}
        type="range"
        min={`${min}`}
        max={`${max}`}
        step={`${step}`}
        onChange={onChangeFn}
        id={id}
        className="text-gray-400 h-[0.45em] w-full"
      />
    </>
  );
};

export default RangeSlider;
