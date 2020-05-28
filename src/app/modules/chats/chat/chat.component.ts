import { Component, OnInit, HostListener, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
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
  //@ViewChild('scrollMe') private myScrollContainer: ElementRef;

  currentChatId: string;
  currentUserId: string;
  currentChat: Chat;
  messages: Message[];
  message: string;
  faSpinner = faSpinner;
  isLoading: boolean;
  isLoadingMessages: boolean;
  isEndOfMessagesList: boolean;
  isFirstLoading: boolean;

  constructor(
      private authenticationService: AuthenticationService,
      private route: ActivatedRoute,
      public modalService: ModalService,
      private router: Router,
      public toastsService: ToastsService,
      private localeService: LocaleService,
      private chatsService: ChatsService) {

    this.isLoading = true;
    this.isLoadingMessages = false;
    this.isEndOfMessagesList = false;
    this.isFirstLoading = true;
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
    if (event.target.scrollHeight - event.target.scrollTop > event.target.scrollHeight - 10 ) {
      if (!this.isEndOfMessagesList && !this.isLoadingMessages){
        this.loadMessages();
      }
    }
  }

  loadMessages(){
    if(!this.isLoadingMessages){
      this.isLoadingMessages = true;
      
      const pageToSend: number = Math.floor(this.messages.length / MESSAGES_PAGE_SIZE) + 1;
      
      console.log("PAGE");
      console.log(pageToSend);

      this.chatsService.getMessagesByPage(this.currentChatId, pageToSend)
      .subscribe(data => {
        console.log("DATA: ");
        console.log(data);
        if(data.length < MESSAGES_PAGE_SIZE){
          this.isEndOfMessagesList = true;
          console.log("END");
        }
        this.messages = data.concat(this.messages);
        this.isLoadingMessages = false;
        if(this.isFirstLoading){
          //this.scrollToBottom();
          this.isFirstLoading = false;
        }
      },
      error => {
        //show toast
      });
    }  
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

  

  // scrollToBottom(): void {
  //   try {
  //       this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  //   } catch(err) { }                 
  // }
}
