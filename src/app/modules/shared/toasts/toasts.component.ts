import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastsService } from '../../core/_services/toasts.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.css']
})
export class ToastsComponent implements OnInit {

  constructor(public toastsService: ToastsService) { }

  ngOnInit(): void {
  }

  isTemplate(toast){return toast.textOrTpl instanceof TemplateRef}
}
