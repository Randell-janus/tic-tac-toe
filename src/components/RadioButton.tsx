interface Props {
  value: string;
  label: string;
  gameMode: string;
}

const RadioButton = ({ value, label, gameMode }: Props) => {
  return (
    <label className="cursor-pointer flex items-center">
      <input
        type="radio"
        className="mr-2 sm:mr-3 cursor-pointer text-indigo-400 focus:ring-0"
        value={value}
        name="mode"
        defaultChecked={gameMode === value}
      />
      {label}
    </label>
  );
};

export default RadioButton;
