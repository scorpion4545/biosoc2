export const DEFAULT_RECRUITMENT_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSe9x4ZHtyQhsN88RHake3Qpr_J0emOWKpGuvBUSdwlQtrK_7Q/viewform?usp=sf_link';

export function normalizeRecruitmentUrl(value: string): string | null {
  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  const valueWithProtocol = /^[a-z][a-z\d+.-]*:/i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const url = new URL(valueWithProtocol);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}