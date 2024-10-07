interface RadioButtonProps {
  text: string;
  value?: string;
  onChangeFn: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked?: boolean;
}

export function RadioButton({
  text,
  value = "",
  onChangeFn,
  isChecked = false,
}: RadioButtonProps) {
  return (
    <div className="flex items-center">
      <input
        id="default-radio-1"
        type="radio"
        value={value}
        name="default-radio"
        className="w-4 h-4 scale-120 cursor-pointer text-blue-600 bg-gray-100 border-gray-300"
        onChange={onChangeFn}
        checked={isChecked}
      />
      <label
        htmlFor="terms"
        className="text-sm font-medium ml-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {text}
      </label>
    </div>
  );
}
