import type {
	IAuthenticateGeneric,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class ShotiumApi implements ICredentialType {
	name = 'shotiumApi';

	displayName = 'Shotium API';

	documentationUrl = 'https://shotium.com/docs';

	icon: Icon = {
		light: 'file:../nodes/Shotium/shotium.svg',
		dark: 'file:../nodes/Shotium/shotium.dark.svg',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			required: true,
			default: '',
			description:
				'Your Shotium API key (starts with sk_live_). Create one on your account page at shotium.com/account.',
		},
		{
			displayName: 'Signing Secret',
			name: 'signingSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description:
				'Only needed for the Generate Signed URL operation. Issued together with your API key.',
		},
		{
			displayName: 'User ID (UID)',
			name: 'uid',
			type: 'string',
			default: '',
			description:
				'Only needed for the Generate Signed URL operation. Issued together with your API key.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};
}
