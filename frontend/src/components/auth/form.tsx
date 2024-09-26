import React from 'react';

interface FormProps {
  fields: { name: string; label: string; inputType: string }[];
  onSubmit: (values: { [key: string]: string }) => void;
}

const AuthForm: React.FC<FormProps> = ({ fields, onSubmit }) => {
  const [values, setValues] = React.useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            type={field.inputType}
            name={field.name}
            id={field.name}
            onChange={handleChange}
            required
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default AuthForm;
