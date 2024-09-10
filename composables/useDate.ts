export function useDate() {
  const formatShort = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
      .format(date);
  };

  return { formatShort };
}
