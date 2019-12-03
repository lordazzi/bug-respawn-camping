export class StringUtil {

  private static instance: StringUtil | null = null;

  private readonly MAX_LABEL_SIZE = 45;
  private readonly NOT_ALPHANUMERIC_CHAR = /[^a-z0-9\s\-]/ig;

  private readonly ACCENT_A = /[áàãâ]/ig;
  private readonly ACCENT_E = /[éèê]/ig;
  private readonly ACCENT_I = /[íì]/ig;
  private readonly ACCENT_O = /[óõòô]/ig;
  private readonly ACCENT_U = /[úùü]/ig;

  constructor() {
    if (!StringUtil.instance) {
      StringUtil.instance = this;
    }

    return StringUtil.instance;
  }

  labelfy(label: string): string {
    return label
      .trim()
      .replace(this.ACCENT_A, 'a')
      .replace(this.ACCENT_E, 'e')
      .replace(this.ACCENT_I, 'i')
      .replace(this.ACCENT_O, 'o')
      .replace(this.ACCENT_U, 'u')
      .replace(this.NOT_ALPHANUMERIC_CHAR, '')
      .replace(/\s+/g, '-')
      .replace(/\[-]+/g, '-')
      .toLowerCase()
      .substr(0, this.MAX_LABEL_SIZE);
  }
}
