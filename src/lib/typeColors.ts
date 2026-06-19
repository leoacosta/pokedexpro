export const TYPE_COLORS: Record<string, string> = {
  normal:   '#b0b098',
  fire:     '#ff6b2b',
  water:    '#4488ee',
  electric: '#f8d838',
  grass:    '#55b53a',
  ice:      '#55cccc',
  fighting: '#cc3344',
  poison:   '#aa44cc',
  ground:   '#cc8833',
  flying:   '#7788dd',
  psychic:  '#ff4488',
  bug:      '#88aa11',
  rock:     '#aa9944',
  ghost:    '#6644aa',
  dragon:   '#4433ee',
  dark:     '#887766',
  steel:    '#8899aa',
  fairy:    '#ee66aa',
};

export function typeColor(type: string): string {
  return TYPE_COLORS[type] ?? '#8a8074';
}
