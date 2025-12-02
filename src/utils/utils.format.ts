const positionWithTeam = (position: string, team?: string) => {
  if (team) {
    return `${position} @ ${team}`;
  }
  return position;
}

const formatMonthYear = (date?: Date) => {
  if (!date) {
    return 'Now';
  }
  const options = {
    year: 'numeric',
    month: 'short',
  } as const;

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = formatter.format(date);
  return formattedDate;
}

export { positionWithTeam, formatMonthYear };
