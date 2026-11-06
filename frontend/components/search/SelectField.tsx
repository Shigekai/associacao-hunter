'use client';

import clsx from 'clsx';
import { useField } from 'formik';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { useId } from 'react';
import { controlClassName, Field } from './Field';

type SelectFieldProps = {
  name: string;
  label: string;
  icon: LucideIcon;
  emptyLabel: string;
  options: { id: number; name: string }[];
};

export function SelectField({
  name,
  label,
  icon,
  emptyLabel,
  options,
}: SelectFieldProps) {
  const [field] = useField<string>(name);
  const id = useId();

  return (
    <Field id={id} label={label} icon={icon}>
      <select
        {...field}
        id={id}
        className={clsx(
          controlClassName,
          'cursor-pointer appearance-none pr-10',
        )}
      >
        <option value="">{emptyLabel}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <ChevronDown
        size={18}
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2"
      />
    </Field>
  );
}
