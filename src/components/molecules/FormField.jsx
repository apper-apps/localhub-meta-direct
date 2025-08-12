import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  name, 
  type = "text", 
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = ""
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={error ? "border-red-500 focus:ring-red-500" : ""}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;