declare module "@solinkcorp/addresser" {

	export function parseAddress(addressString: string): IParsedAddress;
	export function getRandomCity(): { city: string, state: string};
	export function cities(): IStateCities;

	export interface INoonlightFormat {
		line1: string;
		line2?: string;
		city: string;
		state?: string;
		zip: string;
		country: string;
	}

	export interface IParsedAddress {
		zipCode: string;
		zipCodePlusFour?: string;
		stateAbbreviation: string;
		stateName: string;
		placeName: string;
		addressLine1: string;
		addressLine2?: string;
		streetNumber: string;
		streetSuffix: string;
		streetName: string;
		streetDirection?: string;
		country: string;
		countryAbbreviation: string;
		formattedAddress: string;
		id: string;
		format(formatType?: string): INoonlightFormat | IParsedAddress;
	}
}
