export const cleanParams = (values) =>
  Object.fromEntries(Object.entries(values).filter(([, value]) => value !== '' && value !== false && value !== undefined && value !== null));

export const sortOptions = [
  { value: 'featured', label: 'Featured first' },
  { value: 'newest', label: 'Newest' }
];
