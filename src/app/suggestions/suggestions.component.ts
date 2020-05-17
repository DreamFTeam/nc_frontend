import { Component, OnInit } from '@angular/core';
import { Suggestion } from '../_models/suggestion';
import { SuggestionService } from '../_services/suggestion.service';
import { AuthenticationService } from '../_services/authentication.service';
import { Role } from '../_models/role';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit {
  
  suggestions: Suggestion[];

  constructor(private suggestionService: SuggestionService, 
    private authenticationService: AuthenticationService) {
    this.suggestions = [];
  }

  ngOnInit(): void {
    const user = this.authenticationService.currentUserValue;
    if(user && user.role === Role.User)
    this.suggestionService.getSuggestionList().subscribe(ans => 
      {
        console.log(ans);
        this.suggestions = ans
      }, 
      err => console.log(err));
  }

}
