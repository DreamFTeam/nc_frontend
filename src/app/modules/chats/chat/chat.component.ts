import { Component, OnInit, HostListener } from '@angular/core';
import { Message } from '../../core/_models/message';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../core/_services/utils/modal.service';
import { ToastsService } from '../../core/_services/utils/toasts.service';
import { LocaleService } from '../../core/_services/utils/locale.service';
import { Chat } from '../../core/_models/chat';
import { ChatsService } from '../../core/_services/chats/chats.service';
import { Observable } from 'rxjs';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';

const MESSAGES_PAGE_SIZE = 6;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  currentChatId: string;
  currentUserId: string;
  currentChat: Chat;
  messages: Message[];
  message: string;
  faSpinner = faSpinner;
  isLoading: boolean;

  constructor(
      private authenticationService: AuthenticationService,
      private route: ActivatedRoute,
      public modalService: ModalService,
      private router: Router,
      public toastsService: ToastsService,
      private localeService: LocaleService,
      private chatsService: ChatsService) {

    this.messages = [];
    this.currentUserId = this.authenticationService.currentUserValue.id;
    this.currentChatId = this.route.snapshot.paramMap.get('id');
    this.getChatInfo();
    this.loadMessages();
  }

  ngOnInit(): void {
    
  }

  sendMessage():void{
    console.log(this.message);
  }

  getChatInfo():void{
    this.chatsService.getChatById(this.currentChatId)
    .subscribe(x => {
      this.currentChat = x
    },
    err => {
      this.toastsService.toastAddDanger("Something went wrong while fetching chat info");
    });
  }

  @HostListener('scroll', ['$event'])
  onScroll(event){
    console.log(event);
  }

  loadMessages(){
    const pageToSend: number = Math.floor(this.messages.length / MESSAGES_PAGE_SIZE) + 1;
    this.chatsService.getMessagesByPage(this.currentChatId, pageToSend)
    .subscribe(data => {
      this.messages = data.concat(this.messages);
      console.log(this.messages);
    });  
  }

  isAuthor(authorId: string){
    return this.currentUserId === authorId;
  }

  getMessageClass(authorId: string){
    if(this.isAuthor(authorId)){
      return 'd-flex justify-content-end w-100';
    }
    return 'd-flex justify-content-start w-100';
  }
}
