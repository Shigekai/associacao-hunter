'use client';

import { Form, Formik } from 'formik';
import { BookOpen, Hexagon, RotateCcw, Search, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/Button';
import type { Affiliation, Arc, NenCategory } from '@/lib/api';
import { huntersPath } from '@/lib/utils';
import { NameCombobox } from './NameCombobox';
import { SelectField } from './SelectField';

type SearchValues = {
  name: string;
  arcId: string;
  categoryId: string;
  affiliationId: string;
};

const emptyValues: SearchValues = {
  name: '',
  arcId: '',
  categoryId: '',
  affiliationId: '',
};

type SearchFormProps = {
  arcs: Arc[];
  nenCategories: NenCategory[];
  affiliations: Affiliation[];
};

export function SearchForm({
  arcs,
  nenCategories,
  affiliations,
}: SearchFormProps) {
  const router = useRouter();
  const [comboboxKey, setComboboxKey] = useState(0);
  const resetCombobox = () => setComboboxKey((key) => key + 1);

  return (
    <Formik
      initialValues={emptyValues}
      onSubmit={(values) => {
        resetCombobox();
        router.push(huntersPath(values));
      }}
      onReset={resetCombobox}
    >
      <search aria-label="Busca de registros">
        <Form
          action="/hunters"
          method="get"
          autoComplete="off"
          className="flex flex-col gap-3 px-4 pt-4 pb-4.5 desktop:px-5 desktop:pt-4.5 desktop:pb-5"
        >
          <NameCombobox key={comboboxKey} />
          <SelectField
            name="arcId"
            label="Arco"
            icon={BookOpen}
            emptyLabel="Todos os arcos"
            options={arcs}
          />
          <div className="grid gap-3 desktop:grid-cols-2">
            <SelectField
              name="categoryId"
              label="Categoria Nen"
              icon={Hexagon}
              emptyLabel="Todas"
              options={nenCategories}
            />
            <SelectField
              name="affiliationId"
              label="Filiação"
              icon={Users}
              emptyLabel="Todas"
              options={affiliations}
            />
          </div>
          <div className="mt-1 flex gap-2.5">
            <Button
              type="reset"
              variant="secondary"
              aria-label="Limpar filtros"
              className="w-13 shrink-0 desktop:w-auto desktop:px-4"
            >
              <RotateCcw size={18} className="desktop:size-4" />
              <span className="hidden desktop:inline">Limpar</span>
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Buscar
              <Search size={18} strokeWidth={2.25} />
            </Button>
          </div>
        </Form>
      </search>
    </Formik>
  );
}
