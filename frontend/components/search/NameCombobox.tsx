'use client';

import clsx from 'clsx';
import { useField } from 'formik';
import { User, X } from 'lucide-react';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { controlClassName, Field } from './Field';
import { useNameSuggestions } from './useNameSuggestions';

function countLabel(total: number, shown: number) {
  if (total > shown) {
    return `${total} registros · mostrando ${shown}`;
  }
  return total === 1 ? '1 registro' : `${total} registros`;
}

function HighlightedName({ name, query }: { name: string; query: string }) {
  const start = name
    .toLocaleLowerCase('pt-BR')
    .indexOf(query.toLocaleLowerCase('pt-BR'));
  if (start === -1) {
    return <span>{name}</span>;
  }
  const end = start + query.length;
  return (
    <span>
      {name.slice(0, start)}
      <strong className="font-extrabold">{name.slice(start, end)}</strong>
      {name.slice(end)}
    </span>
  );
}

export function NameCombobox() {
  const [field, , helpers] = useField<string>('name');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { result, clear } = useNameSuggestions(field.value, open);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;

  const query = field.value.trim();
  const suggestions = result?.suggestions ?? [];
  const listVisible = open && query !== '' && result !== null;
  const listCurrent = listVisible && result.query === query;
  const active = listCurrent
    ? Math.min(activeIndex, suggestions.length - 1)
    : -1;

  function pick(name: string) {
    void helpers.setValue(name);
    setOpen(false);
    clear();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setOpen(true);
        setActiveIndex(
          Math.max(0, Math.min(active + 1, suggestions.length - 1)),
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(Math.max(active - 1, 0));
        break;
      case 'Enter':
        if (active >= 0) {
          event.preventDefault();
          pick(suggestions[active].name);
        }
        break;
      case 'Escape':
        if (listVisible) {
          event.preventDefault();
          setOpen(false);
        }
        break;
    }
  }

  return (
    <Field id={id} label="Nome" icon={User}>
      <input
        {...field}
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={listVisible}
        aria-controls={listVisible ? listId : undefined}
        aria-activedescendant={active >= 0 ? optionId(active) : undefined}
        autoComplete="off"
        enterKeyHint="search"
        placeholder="Ex.: Kurapika"
        className={clsx(controlClassName, 'pr-12 desktop:pr-11')}
        onChange={(event) => {
          field.onChange(event);
          setOpen(true);
          setActiveIndex(0);
          if (!event.target.value.trim()) {
            clear();
          }
        }}
        onFocus={() => setOpen(true)}
        onBlur={(event) => {
          field.onBlur(event);
          setOpen(false);
        }}
        onKeyDown={handleKeyDown}
      />
      {field.value && (
        <button
          type="button"
          aria-label="Limpar nome"
          className="absolute top-0.5 right-0.5 flex size-11 cursor-pointer items-center justify-center rounded-sm text-ink-muted hover:bg-paper desktop:top-1 desktop:right-1 desktop:size-9"
          onClick={() => {
            void helpers.setValue('');
            clear();
            inputRef.current?.focus();
          }}
        >
          <X size={18} className="desktop:size-4" />
        </button>
      )}
      {listVisible && (
        <div
          className="absolute inset-x-0 top-13.5 z-10 rounded-md border-[1.5px] border-ink bg-white p-1.5 shadow-dropdown desktop:top-12.5"
          onMouseDown={(event) => event.preventDefault()}
        >
          <div
            inert={!listCurrent}
            className="flex flex-col gap-0.5 transition-opacity inert:opacity-50"
          >
            {result.total > 0 && (
              <p className="px-2 pt-1.5 pb-1 font-mono text-micro font-medium tracking-caps-md text-ink-muted uppercase">
                {countLabel(result.total, suggestions.length)}
              </p>
            )}
            <ul
              id={listId}
              role="listbox"
              aria-label="Sugestões de nome"
              className="flex flex-col gap-0.5"
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.id}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === active}
                  className={clsx(
                    'flex h-11 cursor-pointer items-center gap-2.5 rounded-sm px-2.5 text-base desktop:h-10 desktop:text-body',
                    index === active ? 'bg-field' : 'hover:bg-paper',
                  )}
                  onClick={() => pick(suggestion.name)}
                >
                  <User size={14} className="shrink-0 text-ink-muted" />
                  <HighlightedName
                    name={suggestion.name}
                    query={result.query}
                  />
                </li>
              ))}
            </ul>
            {result.total === 0 && (
              <p className="p-2.5 text-body text-ink-muted desktop:text-body-sm">
                Nenhum registro com “{result.query}”.
              </p>
            )}
          </div>
        </div>
      )}
    </Field>
  );
}
