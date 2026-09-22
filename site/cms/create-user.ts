/**
 * Create an account from the command line.
 *
 * The admin panel can create the very first user on its own, so this exists
 * for the cases it cannot cover: adding the client's editor login without
 * handing her an admin session to do it, and recreating an admin after a
 * database branch is reset.
 *
 *   npx payload run cms/create-user.ts -- <email> <password> [admin|editor] [name]
 */
import { getPayload } from 'payload';
import config from '@payload-config';

const [email, password, role = 'editor', ...nameParts] = process.argv.slice(2);

if (!email || !password) {
  console.error('usage: payload run cms/create-user.ts -- <email> <password> [admin|editor] [name]');
  process.exit(1);
}

if (role !== 'admin' && role !== 'editor') {
  console.error(`role must be "admin" or "editor", got "${role}"`);
  process.exit(1);
}

const payload = await getPayload({ config });

const existing = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
});

if (existing.docs[0]) {
  await payload.update({
    collection: 'users',
    id: existing.docs[0].id,
    data: { password, role },
    overrideAccess: true,
  });
  payload.logger.info(`updated ${email} (${role})`);
} else {
  const created = await payload.create({
    collection: 'users',
    data: {
      email,
      password,
      role,
      name: nameParts.join(' ') || email.split('@')[0],
    },
    overrideAccess: true,
  });
  // Read back rather than trust the input: the first-user hook in
  // collections/Users.ts can promote this to admin, and we want to report what
  // was actually stored.
  payload.logger.info(`created ${created.email} with role "${created.role}"`);
}

process.exit(0);
