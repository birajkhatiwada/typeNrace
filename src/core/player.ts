// @ts-nocheck
import { S } from './state';
import { AVS, BGS } from '../config/avatars';

import { RIVALS } from '../config/rides';
export const rivals = () => (S.room && S.room.online ? S.onlineRivals : RIVALS);
export const me = () => ({ name: (S.profile.name || '').trim() || 'You', av: AVS[S.profile.av % AVS.length], color: BGS[S.profile.av % BGS.length] });

