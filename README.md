# LeadsBuilder

Application en français. Installer avec npm install puis npm run build.

Configurer la base avec migrations/001_secure_schema.sql dans Supabase avant de définir SUPABASE_DATA_READY=true. Les accès aux contacts passent exclusivement par le serveur et sont limités au compte connecté. Les données existantes sans propriétaire restent intactes et inaccessibles depuis l’application.

Les paiements et les notifications sortantes restent désactivés jusqu’à leur configuration et leur validation. Ne jamais publier les clés dans GitHub.

