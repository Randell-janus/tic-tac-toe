import { MouseEventHandler } from "react";

interface Props {
  value: string | null;
  onClick: MouseEventHandler<HTMLButtonElement>;
  styles?: string;
}

const Square = ({ value, onClick, styles }: Props) => {
  return (
    <button
      className={`${styles} relative transition-all bg-slate-200 text-slate-900 rounded-lg font-bold p-11 sm:p-20 text-4xl sm:text-8xl`}
      onClick={onClick}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {value}
      </div>
    </button>
  );
};

export default Square;
