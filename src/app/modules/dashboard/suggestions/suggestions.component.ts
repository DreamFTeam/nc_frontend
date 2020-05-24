import { Component, OnInit } from '@angular/core';
import { SuggestionService } from '../../core/_services/user/suggestion.service';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';
import { Role } from '../../core/_models/role';
import { ExtendedQuizPreview } from '../../core/_models/extendedquiz-preview';
import { ToastsService } from '../../core/_services/utils/toasts.service';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit {
  
  mockImgUrl = "../../assets/img/quiz.jpg";
  suggestions: ExtendedQuizPreview[];

  constructor(private suggestionService: SuggestionService, 
    private authenticationService: AuthenticationService,
    public toastsService: ToastsService) {
    this.suggestions = [];
  }

  ngOnInit(): void {
    const user = this.authenticationService.currentUserValue;
    if(user && user.role === Role.User)
    this.suggestionService.getSuggestionList().subscribe(ans => 
      {
        this.suggestions = ans
      }, 
      err => this.toastsService.toastAddDanger("Something went wrong while fetching suggestions.\nWe are sorry for that"));
  }

}
