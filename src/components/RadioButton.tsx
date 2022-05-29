interface Props {
  value: string;
  label: string;
  defaultChecked: string;
  name: string;
}

const RadioButton = ({ value, label, defaultChecked, name }: Props) => {
  return (
    <label className="cursor-pointer flex items-center">
      <input
        type="radio"
        className="mr-2 sm:mr-3 cursor-pointer text-violet-400 focus:ring-0"
        value={value}
        name={name}
        defaultChecked={defaultChecked === value}
      />
      {label}
    </label>
  );
};

export default RadioButton;
