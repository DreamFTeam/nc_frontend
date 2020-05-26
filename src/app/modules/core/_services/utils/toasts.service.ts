import {Injectable, TemplateRef} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ToastsService {
    toasts: any[] = [];

    constructor() {
    }

    /*Shows the toast with a provided message.
      You can provide your own classes for the toast through the options parmether.
      Example of options: { classname: 'bg-success text-light' }
    */
    toastAdd(textOrTpl: string | TemplateRef<any>, options: any = {}) {
        this.toasts.push({textOrTpl, ...options});
    }

    toastAddSuccess(textOrTpl: string | TemplateRef<any>) {
        this.toastAdd(textOrTpl, {classname: 'bg-success text-light'});
    }

    toastAddDanger(textOrTpl: string | TemplateRef<any>) {
        this.toastAdd(textOrTpl, {classname: 'bg-danger text-light'});
    }

    toastAddWarning(textOrTpl: string | TemplateRef<any>) {
        this.toastAdd(textOrTpl, {classname: 'bg-warning text-light'});
    }

    removeToast(toast) {
        this.toasts = this.toasts.filter(t => t !== toast);
    }

    removeAll() {
        this.toasts = [];
    }

}
