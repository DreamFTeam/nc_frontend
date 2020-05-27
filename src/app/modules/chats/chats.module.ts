import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatsPageComponent } from './chats-page/chats-page.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { ChatComponent } from './chat/chat.component';
import { CreateChatComponent } from './create-chat/create-chat.component';
import { ChatSettingsComponent } from './chat-settings/chat-settings.component';



@NgModule({
  declarations: [ChatsPageComponent, ChatComponent, CreateChatComponent, ChatSettingsComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule
  ]
})
export class ChatsModule { }
