import { Component, OnInit } from '@angular/core';
import { ChatsService } from '../../core/_services/chats/chats.service';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';
import { UserView } from '../../core/_models/userview';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.css']
})
export class CreateChatComponent implements OnInit {
  title: string;
  model: UserView;
  searching = false;
  searchFailed = false;
  usersToAdd : UserView[] = [];

  constructor(private chatsService: ChatsService,
    private router: Router,
    ) {
    this.model = null;
   }

  ngOnInit(): void {
  }

  search = (text$: Observable<string>) => 
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
        switchMap(term => 
          this.chatsService.searchFriends(term).pipe(
            tap(() => this.searchFailed = false),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            }))
            ),
            tap(() => this.searching = false)
    );

  createChat(): void{
    if(this.title){
      let participantsArr = Array.from(this.usersToAdd, x => x.id);
      this.chatsService.createGroupChat(this.title, participantsArr).subscribe(
        data => {
          //TODO - add toast
            if(data){
              this.router.navigate(['/chat/'+data]);
            }
          }
      );  
    }
    else{
      //SHOW TOAST
    }
  }

  formatter = (userView: UserView) => userView.username;

  //add user from model to the list of friends to be added to chat
  addCurrentUserModel(){
    if(this.model !== undefined && this.model !== null){
      if(true){
        this.usersToAdd.push(this.model);
        console.log(this.usersToAdd);
        this.model = null;
      }
    }
  }

  removeUser(userId: string){
    this.usersToAdd = this.usersToAdd.filter(obj => obj.id !== userId)
  }

  selectedItem(selectedItem){
    selectedItem.preventDefault();
    this.model = selectedItem.item;
    this.addCurrentUserModel();
  }
}
