export class Setting {
    id: string;
    title: string;
    description: string;
    value: any;

    deserialize(input: any) {
        Object.assign(this, input);
        this.title = "settingTitles."+this.id;
        this.description = "settingDescriptions."+this.id;
        if (this.value === 'true' || this.value === 'false') {
            this.value = this.value === 'true';
        }
        return this;
    }
}
