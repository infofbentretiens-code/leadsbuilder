# LeadsBuilder

CRM en français : contacts personnels au compte, statuts, historique, recherche, export CSV et tableau de bord. L'application ne fournit pas de fichiers de prospects.

## Installation et vérification

Node 22. Installer avec npm install, vérifier avec npm test puis npm run build. Aucun secret ne doit être publié dans ce dépôt. Les valeurs de .env.example sont à renseigner dans les paramètres privés de l'hébergeur.

## Comptes et données

Appliquer migrations/001_secure_schema.sql dans Supabase avant de définir SUPABASE_DATA_READY=true. Les contacts passent par le serveur et sont limités au compte connecté. Les données historiques sans propriétaire restent intactes et inaccessibles depuis l'application.

SESSION_SECRET doit être aléatoire et compter au moins 32 caractères. Les sessions expirent après un jour et sont liées au mot de passe actuel. Cette mise à jour nécessite une reconnexion des anciennes sessions.

## Récupération d'accès

Configurer RESEND_API_KEY et EMAIL_FROM avec un expéditeur validé par Resend. Vérifier la livraison avant de proposer le service comme opérationnel. Le lien est valable une heure et devient invalide après le changement du mot de passe. Aucun jeton de récupération n'est stocké en base. Une mise à jour conditionnelle rend sa consommation atomique.

## Facturation : fermée par défaut

Le site reste en découverte gratuite tant que STRIPE_BILLING_READY et COMMERCIAL_READY ne valent pas true. Avant toute activation : appliquer migrations/002_accounts_billing.sql, confirmer LEGAL_NAME et LEGAL_ADDRESS, configurer les clés privées Stripe, créer les prix récurrents CHF 29/mois et CHF 290/an, renseigner STRIPE_PRICE_MONTHLY et STRIPE_PRICE_ANNUAL, configurer le portail client et l'endpoint /api/webhooks/stripe.

L'endpoint vérifie la signature sur le corps brut. Événements pris en charge : checkout.session.completed et customer.subscription.created/updated/deleted. Tester l'achat en mode test, la synchronisation, les renouvellements, les paiements échoués et la résiliation avant d'activer la production. Aucun paiement réel n'a été vérifié dans cette livraison.

L'accès en écriture payant dépend du statut reçu de Stripe ; lecture, export et suppression restent accessibles. Les redirections de paiement ne donnent pas seules un accès payant.

Les notifications commerciales sortantes restent désactivées. Assistance : info.fbentretiens@gmail.com.
