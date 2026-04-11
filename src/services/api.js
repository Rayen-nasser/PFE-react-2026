/**
 * Backward-compatible barrel.
 * All existing imports like:
 *   import { authService, formationService } from '../services/api'
 * keep working without any changes.
 *
 * New code should import directly:
 *   import authService from '../services/auth'
 *   import formationService from '../services/formations'
 */
export { default as authService }     from './auth';
export { default as formationService } from './formations';
export { default as centreService }    from './centres';
export {
  inscriptionService,
  paiementService,
  avisService,
  favoriService,
  categorieService,
  leconService,
  contentService,
} from './index';

export { default } from './client';