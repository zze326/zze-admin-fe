interface EnumItem {
  value: string | number;
  display: string;
}
export class EnumModel {
  constructor(public enums: EnumItem[] = []) {
    enums.forEach(({ value, display }) => {
      this.addEnum(value, display);
    });
  }

  addEnum(value: string | number, display: string) {
    if (!this.getEnum(value)) this.enums.push({ value, display });
  }

  getEnum(enumValue: string | number) {
    return this.enums.find(({ value }) => value === enumValue) || null;
  }

  displayOf(enumValue: string | number, defaultDisplay = "") {
    const enumItem = this.getEnum(enumValue);
    return enumItem?.display ?? defaultDisplay;
  }

  getEnumList() {
    return this.enums;
  }
}
