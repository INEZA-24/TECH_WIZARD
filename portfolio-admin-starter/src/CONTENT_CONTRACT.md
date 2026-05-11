# Content Contract (Admin -> Portfolio)

## Projects
Admin storage fields:
- `id` (uuid)
- `slug` (string, unique)
- `title` (string)
- `description` (string)
- `image` (string)
- `tags` (string[])
- `github` (string)
- `demo` (string)
- `icon` (string)
- `published` (boolean)
- `sort_order` (number)
- `created_at` (timestamp)
- `updated_at` (timestamp)

Portfolio expected fields at render time:
- `id` (string)
- `title` (string)
- `description` (string)
- `image` (string)
- `tags` (string[])
- `github` (string, optional)
- `demo` (string, optional)
- `icon` (string, optional)
- `published` (boolean)

## Certifications
Admin storage fields:
- `id` (uuid)
- `slug` (string, unique)
- `title` (string)
- `issuer` (string)
- `issued_at` (date, optional)
- `issued_at_label` (string for UI display; example: "March 2026")
- `description` (string)
- `skills` (string[])
- `image` (string)
- `icon` (string)
- `published` (boolean)
- `sort_order` (number)
- `created_at` (timestamp)
- `updated_at` (timestamp)

Portfolio expected fields at render time:
- `id` (string)
- `title` (string)
- `issuer` (string)
- `issuedAt` (string)
- `description` (string)
- `skills` (string[])
- `image` (string)
- `icon` (string, optional)

## Mapping notes
- Map `issued_at_label` -> `issuedAt` in portfolio payloads.
- Keep public field names stable for easy integration.
