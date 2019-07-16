export interface ColorCodeOptions {
  noHtml?: boolean = false;
}
declare const colorCode: {
  (str: string, options?: ColorCodeOptions): string;
}

export = colorCode;