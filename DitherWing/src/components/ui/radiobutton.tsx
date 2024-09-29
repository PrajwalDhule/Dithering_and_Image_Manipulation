interface RadioButtonProps {
  text: string;
  value?: string;
}

export function RadioButton({ text, value = "" }: RadioButtonProps) {
  return (
    <div className="flex items-center mb-4">
      <input
        id="default-radio-1"
        type="radio"
        value={value}
        name="default-radio"
        className="w-4 h-4 scale-120 cursor-pointer text-blue-600 bg-gray-100 border-gray-300"
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
