import { Component, OnInit } from '@angular/core';
import { Message } from '../../core/_models/message';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../core/_services/utils/modal.service';
import { ToastsService } from '../../core/_services/utils/toasts.service';
import { LocaleService } from '../../core/_services/utils/locale.service';
import { ExtendedQuiz } from '../../core/_models/extended-quiz';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  currentChatId: string;
  messages: Message[];

  constructor(private route: ActivatedRoute,
    public modalService: ModalService,
    private router: Router,
    public toastsService: ToastsService,
    private localeService: LocaleService) {

    this.currentChatId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    
  }

  



}
