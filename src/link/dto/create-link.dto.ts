export class CreateLinkDto {
  originalUrl: string;
  alternativeUrls?: string[]; // optional
  weights?: number[]; // optional
}
