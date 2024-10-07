interface DividerProps {
  classNames?: string;
}

const Divider = ({ classNames }: DividerProps) => {
  return (
    <div className={`col-span-2 h-[0.25px] bg-gray-800 ${classNames}`}></div>
  );
};

export default Divider;
