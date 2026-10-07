// Platforms built on SOAJS. Service counts are SOAJS services found in each
// codebase (a config.js with serviceName that depends on `soajs`).
// Keep customer names, vendors and deployment specifics out of this file.

export interface Platform {
	id: string;
	name: string;
	domain: string;
	url?: string;
	services: number;
	summary: string;
	points: string[];
	soajs: string[];
}

export const platforms: Platform[] = [
	{
		id: 'connect-spaces',
		name: 'Connect Spaces',
		domain: 'Secure communications',
		url: 'https://www.connectspaces.io',
		services: 23,
		summary:
			'Chat, end-to-end-encrypted calls and meetings, with separate Spaces per organisation, deployed in the cloud or fully air-gapped.',
		points: [
			'23 Node.js microservices behind one SOAJS gateway running three replicas.',
			'Each customer network is modelled as a SOAJS tenant, with products and ACL per environment.',
			'Every service gets OAuth, tenant keys and user ACL from its SOAJS config, with no auth code of its own.',
			'The real-time WebSocket and cross-network relay layers authenticate through the gateway ACL and send API calls through the gateway pipeline.',
			'The same Helm charts deploy to managed cloud Kubernetes and to on-prem, air-gapped clusters.',
		],
		soajs: ['Gateway', 'OAuth', 'URAC', 'Multitenant', 'Console', 'Helm', 'Static UIs', 'CronJobs'],
	},
	{
		id: 'aomie',
		name: 'Aomie',
		domain: 'Regulated healthcare',
		url: 'https://www.aomie.com',
		services: 22,
		summary:
			'A multi-tenant platform for regulated medical-cannabis care: patients, prescriptions, catalog, orders and compliance, with AI-assisted prescription processing.',
		points: [
			'22 Node.js microservices covering patients, prescriptions, catalog, inventories, carts, orders, taxes, rewards, legal and analytics.',
			'Every service requires a tenant key, an OAuth token and a URAC user from its SOAJS config; most also use per-tenant profiles.',
			'Separate admin, enterprise and patient web portals, each a SOAJS tenant application on the same gateway.',
			'A Python OCR service that extracts patient data from prescriptions is registered with the SOAJS gateway, so it sits behind the same keys and ACL as the Node.js services.',
			'Order and prescription processing drivers run as scheduled jobs deployed through SOAJS.',
		],
		soajs: ['Gateway', 'OAuth', 'URAC', 'Tenant profiles', 'Static UIs', 'CronJobs', 'Mixed languages'],
	},
	{
		id: 'influence',
		name: 'INFLUENCE by The London Fund',
		domain: 'Venture and capital operations',
		services: 25,
		summary:
			'A venture-as-a-service operating system covering deals, campaigns, accounts and e-signature, with an event-driven financial back end.',
		points: [
			'25 microservices covering deals, campaigns, sponsors, referrals, accounts, assets, e-signature, support and analytics, plus event-driven daemons that compute deal value.',
			'Services call each other through SOAJS inter-service connections, with tenant context carried on every call.',
			'A web portal, a progressive web app and a mobile app share the same gateway and ACL.',
		],
		soajs: ['Gateway', 'OAuth', 'URAC', 'Tenant profiles', 'Daemons', 'Static UIs'],
	},
	{
		id: 'coupond',
		name: 'Coupond',
		domain: 'Retail loyalty and promotions',
		services: 16,
		summary: 'A loyalty and promotions platform with a rules-based promotions engine, catalog, scan analytics and point-of-sale integrations.',
		points: [
			'16 microservices including promotions, catalog, products, calendar, pack codes and scan analytics.',
			'Point-of-sale integrations are registered as SOAJS resources rather than built as custom services.',
		],
		soajs: ['Gateway', 'OAuth', 'URAC', 'Tenant profiles', 'Resources'],
	},
	{
		id: 'nell',
		name: 'Nell',
		domain: 'IoT orchestration',
		services: 18,
		summary: 'Multi-network IoT orchestration across LoRaWAN, BLE, GPS and Wi-Fi, with fleet device management and logistics tools.',
		points: [
			'18 microservices run the business layer: tags, networks, catalog, commerce, webhooks, reporting and analytics.',
			'A dedicated LoRaWAN network server handles the radio layer; SOAJS handles tenants, users and APIs.',
			'Admin, enterprise and public web apps are served as SOAJS static UIs.',
		],
		soajs: ['Gateway', 'OAuth', 'URAC', 'Tenant profiles', 'Static UIs'],
	},
	{
		id: 'carrot',
		name: 'Carrot',
		domain: 'Social media and web3',
		services: 15,
		summary:
			'A blockchain-enabled social platform built around modular content Cards, with creator-governed access, AI moderation and tokenised ownership.',
		points: [
			'15 microservices for cards, friends, invitations, spaces, governance, wallets, identity, AI and analytics.',
			'Every service requires a tenant key, an OAuth token and a URAC user from its SOAJS config.',
			'Wallet and governance logic sits behind the same gateway ACL as the social features; on-chain contracts run outside SOAJS.',
		],
		soajs: ['Gateway', 'OAuth', 'URAC', 'Inter-service calls'],
	},
	{
		id: 'slic',
		name: 'SLIC',
		domain: 'Creator–brand marketplace',
		services: 7,
		summary: 'A marketplace connecting creators and brands, with campaign workflows, automated payouts and ROI reporting.',
		points: [
			'7 microservices for organisations, campaigns, content and onboarding.',
			'Four role-specific web apps (brand, creator, collective and admin portal) on one gateway, each with its own access.',
		],
		soajs: ['Gateway', 'OAuth', 'URAC', 'Static UIs'],
	},
];

export const totals = {
	platforms: platforms.length,
	services: platforms.reduce((n, p) => n + p.services, 0),
};
