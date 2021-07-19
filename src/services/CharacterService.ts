import { Cast } from 'interfaces/characters';

import api from '../config/api';

export const getCharacter = (id: string) => api.get<any>(`people/${id}`);

export const getCharacters = () => api.get<Cast>('people');
