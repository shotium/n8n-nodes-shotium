import type {
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	IExecuteFunctions,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const BASE_URL = 'https://api.shotium.com/v1';

export class Shotium implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Shotium',
		name: 'shotium',
		icon: { light: 'file:shotium.svg', dark: 'file:shotium.dark.svg' },
		group: ['transform'],
		version: [1],
		subtitle: '={{$parameter["operation"]}}',
		description: 'Turn any URL into an image with the Shotium rendering API',
		defaults: {
			name: 'Shotium',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'shotiumApi',
				required: true,
				testedBy: 'shotiumApiTest',
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Generate OG Image',
						value: 'ogImage',
						action: 'Generate an open graph image from a template',
						description: 'Render a 1200×630 social card from one of five typed templates',
					},
					{
						name: 'Take Screenshot',
						value: 'screenshot',
						action: 'Take a screenshot of a URL',
						description: 'Render any public URL to a PNG, JPEG or WebP image',
					},
				],
				default: 'screenshot',
			},

			// ----------------------------------
			//         screenshot
			// ----------------------------------
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://example.com',
				description: 'The public http(s) URL to render',
				displayOptions: {
					show: {
						operation: ['screenshot'],
					},
				},
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add option',
				default: {},
				displayOptions: {
					show: {
						operation: ['screenshot'],
					},
				},
				options: [
					{
						displayName: 'Format',
						name: 'format',
						type: 'options',
						options: [
							{ name: 'JPEG', value: 'jpeg' },
							{ name: 'PNG', value: 'png' },
							{ name: 'WebP', value: 'webp' },
						],
						default: 'png',
						description: 'Image format of the rendered screenshot',
					},
					{
						displayName: 'Full Page',
						name: 'fullPage',
						type: 'boolean',
						default: false,
						description: 'Whether to capture the full scroll height of the page (up to 20,000px)',
					},
					{
						displayName: 'Quality',
						name: 'quality',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 100,
						},
						default: 80,
						description: 'Compression quality for lossy formats (JPEG and WebP), ignored for PNG',
					},
					{
						displayName: 'Viewport Height',
						name: 'height',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 2160,
						},
						default: 800,
						description: 'Viewport height in pixels',
					},
					{
						displayName: 'Viewport Width',
						name: 'width',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 3840,
						},
						default: 1280,
						description: 'Viewport width in pixels',
					},
				],
			},

			// ----------------------------------
			//         ogImage
			// ----------------------------------
			{
				displayName: 'Template',
				name: 'template',
				type: 'options',
				options: [
					{ name: 'Blog', value: 'blog', description: 'Article card with author, site name, tag and avatar' },
					{ name: 'Event', value: 'event', description: 'Event card with date, location and organizer' },
					{ name: 'Minimal', value: 'minimal', description: 'Title and subtitle on a clean canvas' },
					{ name: 'Podcast', value: 'podcast', description: 'Episode card with show name and cover art' },
					{ name: 'Product', value: 'product', description: 'Split layout with product shot, price and brand' },
				],
				default: 'minimal',
				description: 'Which OG image template to render',
				displayOptions: {
					show: {
						operation: ['ogImage'],
					},
				},
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				default: '',
				description: 'Main title text of the OG image',
				displayOptions: {
					show: {
						operation: ['ogImage'],
					},
				},
			},
			{
				displayName: 'Subtitle',
				name: 'subtitle',
				type: 'string',
				default: '',
				description: 'Secondary line under the title',
				displayOptions: {
					show: {
						operation: ['ogImage'],
						template: ['minimal'],
					},
				},
			},
			{
				displayName: 'Author',
				name: 'author',
				type: 'string',
				default: '',
				description: 'Author name shown on the card',
				displayOptions: {
					show: {
						operation: ['ogImage'],
						template: ['blog'],
					},
				},
			},
			{
				displayName: 'Site Name',
				name: 'siteName',
				type: 'string',
				default: '',
				description: 'Site or publication name',
				displayOptions: {
					show: {
						operation: ['ogImage'],
						template: ['blog'],
					},
				},
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'string',
				default: '',
				description: 'Short category tag, e.g. Engineering',
				displayOptions: {
					show: {
						operation: ['ogImage'],
						template: ['blog'],
					},
				},
			},
			{
				displayName: 'Avatar URL',
				name: 'avatarUrl',
				type: 'string',
				default: '',
				description: 'Public URL of the author avatar image',
				displayOptions: {
					show: {
						operation: ['ogImage'],
						template: ['blog'],
					},
				},
			},
			{
				displayName: 'Brand',
				name: 'brand',
				type: 'string',
				default: '',
				description: 'Brand or company name',
				displayOptions: {
					show: {
						operation: ['ogImage'],
						template: ['product'],
					},
				},
			},
			{
				displayName: 'Price',
				name: 'price',
				type: 'string',
				default: '',
				description: 'Price text shown in the price pill, e.g. From $15/mo',
				displayOptions: {
					show: {
						operation: ['ogImage'],
						template: ['product'],
					},
				},
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Short product description',
				displayOptions: {
					show: {
						operation: ['ogImage'],
						template: ['product'],
					},
				},
			},
			{
				displayName: 'Image URL',
				name: 'imageUrl',
				type: 'string',
				default: '',
				description: 'Public URL of the product image',
				displayOptions: {
					show: {
						operation: ['ogImage'],
						template: ['product'],
					},
				},
			},
			{
				displayName: 'Show Name',
				name: 'showName',
				type: 'string',
				default: '',
				description: 'Podcast show name',
				displayOptions: {
					show: {
						operation: ['ogImage'],
						template: ['podcast'],
					},
				},
			},
			{
				displayName: 'Episode',
				name: 'episode',
				type: 'string',
				default: '',
				description: 'Episode label, e.g. EP 42',
				displayOptions: {
					show: {
						operation: ['ogImage'],
						template: ['podcast'],
					},
				},
			},
			{
				displayName: 'Cover URL',
				name: 'coverUrl',
				type: 'string',
				default: '',
				description: 'Public URL of the episode or show cover art',
				displayOptions: {
					show: {
						operation: ['ogImage'],
						template: ['podcast'],
					},
				},
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'string',
				default: '',
				description: 'Event date text, e.g. Sep 12, 2026',
				displayOptions: {
					show: {
						operation: ['ogImage'],
						template: ['event'],
					},
				},
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				default: '',
				description: 'Event location text',
				displayOptions: {
					show: {
						operation: ['ogImage'],
						template: ['event'],
					},
				},
			},
			{
				displayName: 'Organizer',
				name: 'organizer',
				type: 'string',
				default: '',
				description: 'Event organizer name',
				displayOptions: {
					show: {
						operation: ['ogImage'],
						template: ['event'],
					},
				},
			},
			{
				displayName: 'Format',
				name: 'ogFormat',
				type: 'options',
				options: [
					{ name: 'JPEG', value: 'jpeg' },
					{ name: 'PNG', value: 'png' },
				],
				default: 'png',
				description: 'Image format of the rendered OG image',
				displayOptions: {
					show: {
						operation: ['ogImage'],
					},
				},
			},

			// ----------------------------------
			//         shared
			// ----------------------------------
			{
				displayName: 'Put Output in Field',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				description: 'The name of the output binary field to put the image in',
			},
		],
	};

	methods = {
		credentialTest: {
			// Zero-cost key check: the API validates auth before params, so a
			// parameterless request proves the key without billing a render.
			async shotiumApiTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				const apiKey = credential.data?.apiKey as string | undefined;
				try {
					// Native fetch: ICredentialTestFunctions helpers only expose the
					// deprecated `request`, and a status check needs no n8n plumbing.
					const response = await fetch(`${BASE_URL}/screenshot`, {
						headers: { Authorization: `Bearer ${apiKey ?? ''}` },
					});
					if (response.status === 401) {
						return { status: 'Error', message: 'Invalid API key' };
					}
					return { status: 'OK', message: 'Authentication successful' };
				} catch {
					return { status: 'Error', message: 'Could not reach the Shotium API' };
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const binaryPropertyName = this.getNodeParameter(
					'binaryPropertyName',
					itemIndex,
				) as string;

				let body: Buffer;
				let format: string;

				if (operation === 'screenshot') {
					const url = this.getNodeParameter('url', itemIndex) as string;
					const options = this.getNodeParameter('options', itemIndex, {}) as {
						width?: number;
						height?: number;
						fullPage?: boolean;
						format?: string;
						quality?: number;
					};
					format = options.format ?? 'png';

					const qs: IDataObject = { url };
					if (options.width !== undefined) qs.width = options.width;
					if (options.height !== undefined) qs.height = options.height;
					if (options.fullPage !== undefined) qs.full_page = String(options.fullPage);
					if (options.format !== undefined) qs.format = options.format;
					if (options.quality !== undefined) qs.quality = options.quality;

					const response = (await this.helpers.httpRequestWithAuthentication.call(
						this,
						'shotiumApi',
						{
							method: 'GET',
							url: `${BASE_URL}/screenshot`,
							qs,
							encoding: 'arraybuffer',
						},
					)) as Buffer;
					body = Buffer.from(response);
				} else {
					const template = this.getNodeParameter('template', itemIndex) as string;
					const title = this.getNodeParameter('title', itemIndex) as string;
					format = this.getNodeParameter('ogFormat', itemIndex, 'png') as string;

					const params: IDataObject = { title };
					const collect = (nodeParam: string, apiParam: string) => {
						const value = this.getNodeParameter(nodeParam, itemIndex, '') as string;
						if (value !== '') params[apiParam] = value;
					};
					if (template === 'minimal') {
						collect('subtitle', 'subtitle');
					} else if (template === 'blog') {
						collect('author', 'author');
						collect('siteName', 'site_name');
						collect('tag', 'tag');
						collect('avatarUrl', 'avatar_url');
					} else if (template === 'product') {
						collect('brand', 'brand');
						collect('price', 'price');
						collect('description', 'description');
						collect('imageUrl', 'image_url');
					} else if (template === 'podcast') {
						collect('showName', 'show_name');
						collect('episode', 'episode');
						collect('coverUrl', 'cover_url');
					} else if (template === 'event') {
						collect('date', 'date');
						collect('location', 'location');
						collect('organizer', 'organizer');
					}

					const response = (await this.helpers.httpRequestWithAuthentication.call(
						this,
						'shotiumApi',
						{
							method: 'POST',
							url: `${BASE_URL}/og-image`,
							body: { template, params, format },
							encoding: 'arraybuffer',
						},
					)) as Buffer;
					body = Buffer.from(response);
				}

				const fileName = operation === 'screenshot' ? `screenshot.${format}` : `og-image.${format}`;
				const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
				const binaryData = await this.helpers.prepareBinaryData(body, fileName, mimeType);

				returnData.push({
					json: {
						operation,
						format,
						fileName,
						size: body.length,
					},
					binary: {
						[binaryPropertyName]: binaryData,
					},
					pairedItem: itemIndex,
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						error: error as NodeOperationError,
						pairedItem: itemIndex,
					});
				} else {
					throw new NodeOperationError(this.getNode(), error as Error, {
						itemIndex,
					});
				}
			}
		}

		return [returnData];
	}
}
