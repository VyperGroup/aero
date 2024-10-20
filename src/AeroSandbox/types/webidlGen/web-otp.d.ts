// Auto-generated by webidl2ts - https://wicg.github.io/web-otp/
interface OTPCredential extends Credential {
	readonly code: string;
}
declare var OTPCredential: OTPCredential;
interface CredentialRequestOptions {
	otp?: OTPCredentialRequestOptions;
}
interface OTPCredentialRequestOptions {
	transport?: Array<OTPCredentialTransportType>;
}
enum OTPCredentialTransportType {
	sms = 0
}
