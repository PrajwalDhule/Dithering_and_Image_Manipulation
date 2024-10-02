interface RangeSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChangeFn: (event: string, ...args: string[]) => void;
  onChangeFnArgs?: any[];
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
  onChangeFnArgs,
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
        onChange={(e) => {
          onChangeFnArgs
            ? onChangeFn(e.target.value, ...onChangeFnArgs)
            : onChangeFn(e.target.value);
        }}
        id={id}
        className="text-gray-400 h-[0.45em] w-full cursor-pointer"
      />
    </>
  );
};

export default RangeSlider;
