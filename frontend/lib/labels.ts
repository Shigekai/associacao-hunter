export const labels = {
  licensed: 'Licenciado',
  notLicensed: 'Não licenciado',
  unknown: 'Desconhecido',
  none: 'Nenhuma',
  allArcs: 'Todos',
  all: 'Todas',
  notRegistered: 'Não registrado',
  licensedHunter: 'Hunter licenciado',
  commonItem: '— item comum',
  nenMark: 'Nen',
  noAbilities: 'Nenhuma habilidade registrada.',
  noItems: 'Nenhum item registrado.',
  showLess: 'Ver menos',
};

export function recordCount(total: number) {
  return total === 1 ? '1 registro' : `${total} registros`;
}

export function affiliationCount(total: number) {
  return total === 1 ? '1 filiação' : `${total} filiações`;
}

export function situation(isAlive: boolean, sex: string | null) {
  const female = sex === 'Feminino';
  if (isAlive) {
    return female ? 'Viva' : 'Vivo';
  }
  return female ? 'Morta' : 'Morto';
}

export function showAllAbilities(total: number) {
  return `Ver as ${total} habilidades`;
}

export function shownOf(shown: number, total: number) {
  return `${shown} de ${total}`;
}
