import type { Access, FieldAccess } from 'payload';

/**
 * Two roles, and the split matters.
 *
 * `admin` is the build owner. `editor` is the client — she can change the
 * content this site sells on (photos, services, the phone number) and nothing
 * that can break the site or hand out access. Anyone logged in can read;
 * everything else is admin-only or admin-plus-editor.
 *
 * Read is public because the published pages are rendered from these
 * collections at build time. Drafts are excluded separately by the
 * `_status` filter Payload applies when versions are on.
 */

export type Role = 'admin' | 'editor';

export const anyone: Access = () => true;

export const isSignedIn: Access = ({ req }) => Boolean(req.user);

export const isAdmin: Access = ({ req }) => req.user?.role === 'admin';

export const isAdminFieldLevel: FieldAccess = ({ req }) => req.user?.role === 'admin';

/** Content the client owns: either role may write. */
export const canEditContent: Access = ({ req }) =>
  req.user?.role === 'admin' || req.user?.role === 'editor';
