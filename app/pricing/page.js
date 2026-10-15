'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'starter', name: 'Essentiel',
      monthlyPrice: 29,
      annualPrice: 290,
      description: 'Parfait pour commencer',
      features: [
        'Jusqu\'à 50 leads par mois',
        'Gestion de base des leads',
        'Notifications par email',
        'Export CSV',
        'Support par email',
      ],
      cta: 'Commencer',
      highlighted: false,
    },
    {
      id: 'professional', name: 'Professionnel',
      monthlyPrice: 79,
      annualPrice: 790,
      description: 'Le plus populaire pour les équipes en croissance',
      features: [
        'Leads illimités',
        'Filtrage et recherche avancés',
        'Suivi de statut personnalisé',
        'Collaboration d\'équipe (jusqu\'à 3 utilisateurs)',
        'Analytique détaillée',
        'Support email prioritaire',
        'Accès API (lecture seule)',
      ],
      cta: 'Essai gratuit',
      highlighted: true,
    },
    {
      id: 'enterprise', name: 'Entreprise',
      monthlyPrice: 199,
      annualPrice: 1990,
      description: 'Pour les grandes organisations',
      features: [
        'Tout inclus dans Professionnel',
        'Membres d\'équipe illimités',
        'Rôles et permissions personnalisés',
        'Accès API complet',
        'Support des webhooks',
        'Rapports avancés',
        'Support dédié',
        'Intégrations personnalisées',
      ],
      cta: 'Contacter les ventes',
      highlighted: false,
    },
  ];

  const getCurrentPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tarification simple et transparente
          </h1>
<p className="text-center text-amber-800 bg-amber-50 p-4 rounded-lg my-6">Offres en préparation. Les fonctionnalités indiquées ci-dessous sont prévues pour le lancement commercial. Aucun paiement n’est actuellement prélevé.</p>
          <p className="text-xl text-gray-600 mb-8">
            Choisissez le forfait idéal pour votre entreprise
          </p>

          <div className="flex justify-center items-center gap-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Mensuel
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-300"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                  billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
              Annuel <span className="text-green-600 font-bold">2 mois offerts</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 ${
                plan.highlighted
                  ? 'ring-2 ring-blue-500 md:scale-105 bg-white'
                  : 'bg-white'
              }`}
            >
              {plan.highlighted && (
                <div className="bg-blue-500 text-white text-center py-2 font-semibold">
                  Le plus populaire
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    CHF {getCurrentPrice(plan)}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /{billingCycle === 'monthly' ? 'mois' : 'an'}
                  </span>
                </div>

                <Link
                  href={`/auth/signup?plan=${plan.id}&billing=${billingCycle}`}
                  className={`block w-full py-3 px-6 rounded-lg font-semibold text-center transition mb-8 ${
                    plan.highlighted
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>

                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Questions fréquemment posées
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Puis-je changer mon forfait à tout moment ?
              </h3>
              <p className="text-gray-600">
                La gestion des abonnements sera disponible lors du lancement commercial. Aucun abonnement payant n’est actuellement activé.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Offrez-vous un essai gratuit ?
              </h3>
              <p className="text-gray-600">
                Oui, tous les forfaits comprennent un essai gratuit de 14 jours. Aucune carte de crédit requise pour commencer.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Quelles méthodes de paiement acceptez-vous ?
              </h3>
              <p className="text-gray-600">
                Les paiements ne sont pas encore activés. Les moyens de paiement disponibles seront précisés lors du lancement commercial.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Y a-t-il un contrat ou des frais d'installation ?
              </h3>
              <p className="text-gray-600">
                La création du compte de test ne déclenche aucun paiement. Les conditions commerciales seront précisées avant toute souscription payante.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Offrez-vous des réductions pour la facturation annuelle ?
              </h3>
              <p className="text-gray-600">
                Oui ! Les tarifs annuels prévus correspondent à dix mensualités, soit deux mois offerts.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Des questions ? <Link href="/contact" className="text-blue-500 hover:text-blue-600 font-semibold">
              Contactez notre équipe commerciale
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
