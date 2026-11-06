export const labels = {
  licensed: 'Licenciado',
  notLicensed: 'Não licenciado',
  unknown: 'Desconhecido',
  none: 'Nenhuma',
  allArcs: 'Todos',
  all: 'Todas',
};

export function recordCount(total: number) {
  return total === 1 ? '1 registro' : `${total} registros`;
}

export function affiliationCount(total: number) {
  return total === 1 ? '1 filiação' : `${total} filiações`;
}
