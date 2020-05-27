import { Component, OnInit } from '@angular/core';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Chat } from '../../core/_models/chat';
import { ChatsService } from '../../core/_services/chats/chats.service';

@Component({
  selector: 'app-chats-page',
  templateUrl: './chats-page.component.html',
  styleUrls: ['./chats-page.component.css']
})
export class ChatsPageComponent implements OnInit {
  activeId: string;
  chatsList$: Observable<Chat[]>;
  isLoading: boolean;
  isEmpty: boolean;
  faSpinner = faSpinner;

  constructor(private chatsService: ChatsService) { 
    this.isLoading = true;
    this.isEmpty = false;
    this.activeId = "";
  }

  ngOnInit(): void {
    this.getChatsList();
  }

  getChatsList(): void {
    this.chatsList$ = this.chatsService.getChatsList();
    this.chatsList$.subscribe(data => {
      if(data.length == 0){
        this.isEmpty = true;
      }
      this.isLoading = false;
    });
  }

  onClick(chatId: string){
    this.activeId = chatId;
  }

}
