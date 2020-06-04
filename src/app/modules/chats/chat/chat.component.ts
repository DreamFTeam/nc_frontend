import { Component, OnInit, HostListener, AfterViewChecked, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Message } from '../../core/_models/message';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../core/_services/utils/modal.service';
import { ToastsService } from '../../core/_services/utils/toasts.service';
import { LocaleService } from '../../core/_services/utils/locale.service';
import { Chat } from '../../core/_models/chat';
import { ChatsService } from '../../core/_services/chats/chats.service';
import { Observable, Subscription } from 'rxjs';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { ReceivedEvent } from '../../core/_models/receivedevent';
import { environment } from 'src/environments/environment';
import { EventType } from '../../core/_models/eventtype';
import { DateService } from '../../core/_services/utils/date.service';
import { StompSubscription } from '@stomp/stompjs';


const MESSAGES_PAGE_SIZE = 6;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnDestroy, OnInit{
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  currentChatId: string;
  currentUserId: string;
  currentUsername: string;
  currentChat: Chat;
  messages: Message[];
  message: string;
  faSpinner = faSpinner;
  isLoading: boolean;
  isLoadingMessages: boolean;
  isEndOfMessagesList: boolean;
  isFirstLoading: boolean;

  //for sockets
  stompClient: any;
  socketSub: StompSubscription;
  stomp: any;
  receivedEvent: ReceivedEvent;

  constructor(
      private authenticationService: AuthenticationService,
      private route: ActivatedRoute,
      public modalService: ModalService,
      private router: Router,
      public toastsService: ToastsService,
      private localeService: LocaleService,
      private chatsService: ChatsService,
      public dateService: DateService) {

    this.isLoading = true;
    this.isLoadingMessages = false;
    this.isEndOfMessagesList = false;
    this.isFirstLoading = true;
    this.messages = [];

    this.currentUserId = this.authenticationService.currentUserValue.id;
    this.currentUsername = this.authenticationService.currentUserValue.username;
    this.currentChatId = this.route.snapshot.paramMap.get('id');
    this.getChatInfo();
  }

  ngOnInit(){
    this.loadMessages(0);
  }

  ngOnDestroy(): void {
    this.socketSub.unsubscribe();
    this.stompClient.disconnect();
  }

  openWebSocket(){
    let ws = new SockJS(environment.socketUrl);
    let stompClient = Stomp.Stomp.over(ws);
    this.stompClient = stompClient;
    
    //let that = this;

    stompClient.connect({}, function(){
      const url = '/topic/messages/' + this.currentChatId;
      const callback = (message) => {
        if(message.body){
          let receivedMessage = JSON.parse(message.body);
          this.messages.push(receivedMessage);
        }
      };
      this.socketSub = stompClient.subscribe(url, callback);
    }, this);
  }

  sendMessage():void{
      if (!this.message) {
        this.toastsService.toastAddDanger("Message field is empty.\n Please type something");
      }else{
        let messageToSend = new Message(this.currentUserId, this.currentUsername, this.message);
        this.stompClient.send('/app/chat/' + this.currentChatId, {}, JSON.stringify(messageToSend));
        this.message= '';
        this.scrollToBottom();
      }
    }

  getChatInfo():void{
    this.chatsService.getChatById(this.currentChatId)
    .subscribe(x => {
      this.currentChat = x;
      this.openWebSocket();
    },
    err => {
      this.toastsService.toastAddDanger("Something went wrong while fetching chat info");
    });
  }

  @HostListener('scroll', ['$event'])
  onScroll(event){
    if (event.target.scrollHeight - event.target.scrollTop > event.target.scrollHeight - 10 ) {
      if (!this.isEndOfMessagesList && !this.isLoadingMessages){
        this.loadMessages(event.target.scrollHeight);
      }
    }
  }

  saveScrollTop(prevHeight: number){
      setTimeout(() => {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight - prevHeight;
      }, 0);
  }

  loadMessages(previousScrollHeight: number){
    if(!this.isLoadingMessages){
      this.isLoadingMessages = true;
      
      const pageToSend: number = Math.floor(this.messages.length / MESSAGES_PAGE_SIZE) + 1;
      
      this.chatsService.getMessagesByPage(this.currentChatId, pageToSend)
      .subscribe(data => {
        if(data.length < MESSAGES_PAGE_SIZE){
          this.isEndOfMessagesList = true;
        }
        this.messages = data.concat(this.messages);
        this.isLoadingMessages = false;
        if(this.isFirstLoading){
          this.scrollToBottom();
          this.isFirstLoading = false;
        }else{
          this.saveScrollTop(previousScrollHeight);
        }
      },
      error => {
        this.toastsService.toastAddDanger("An error occured while fetching messages.\nWe are sorry for that");
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

  scrollToBottom(): void {
     try {
         setTimeout(()=>{
            this.myScrollContainer.nativeElement.scrollTop 
            = this.myScrollContainer.nativeElement.scrollHeight; 
          },0);
        } catch(err) { }                 
   }
}
