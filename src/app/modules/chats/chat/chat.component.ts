import { Component, OnInit } from '@angular/core';
import { Message } from '../../core/_models/message';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../core/_services/utils/modal.service';
import { ToastsService } from '../../core/_services/utils/toasts.service';
import { LocaleService } from '../../core/_services/utils/locale.service';
import { Chat } from '../../core/_models/chat';
import { ChatsService } from '../../core/_services/chats/chats.service';
import { Observable } from 'rxjs';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  currentChatId: string;
  currentChat: Chat;
  messages: Message[];
  message: string;
  faSpinner = faSpinner;

  constructor(private route: ActivatedRoute,
    public modalService: ModalService,
    private router: Router,
    public toastsService: ToastsService,
    private localeService: LocaleService,
    private chatsService: ChatsService) {

    this.currentChatId = this.route.snapshot.paramMap.get('id');
    this.getChatInfo();
  }

  ngOnInit(): void {
    
  }

  sendMessage():void{
    console.log(this.message);
  }

  getChatInfo():void{
    this.chatsService.getChatById(this.currentChatId)
    .subscribe(x => {this.currentChat = x});
  }
}
