import type { CollectionConfig } from 'payload';
import { isAdmin, isAdminFieldLevel } from '../access';

/**
 * Email + password, deliberately.
 *
 * The client is a painter, not a developer. A git-backed CMS would have made
 * her create a GitHub account and accept a repo invite before she could fix
 * her own phone number; this is the reason Payload was chosen over Keystatic.
 *
 * `role` is admin-only at the field level, so an editor cannot promote
 * herself by editing her own profile — Payload lets a user update their own
 * record by default, and without this that would include `role`.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    // Payload already scopes a non-admin to their own record for read/update.
    admin: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      /*
        The first account has to be an admin, or the panel locks itself out.
        Payload waives access control for the create-first-user screen, but the
        `role` field still defaults to editor and is admin-only writable — and
        there is no admin logged in at that moment to write it. Without this the
        founding account lands as an editor, `create: isAdmin` then refuses
        every further user, and the only way back in is a manual UPDATE against
        the database.
      */
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data;
        const { totalDocs } = await req.payload.count({ collection: 'users' });
        return totalDocs === 0 ? { ...data, role: 'admin' } : data;
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin (full access)', value: 'admin' },
        { label: 'Editor (content only)', value: 'editor' },
      ],
      access: { create: isAdminFieldLevel, update: isAdminFieldLevel },
      admin: { description: 'Editors can change content but not users or settings.' },
    },
  ],
};
