import { Component, OnInit } from '@angular/core';
import { Suggestion } from '../_models/suggestion';
import { SuggestionService } from '../_services/suggestion.service';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit {
  
  suggestions: Suggestion[];

  constructor(private suggestionService: SuggestionService) {
    this.suggestions = [];
  }

  ngOnInit(): void {
    this.suggestionService.getSuggestionList().subscribe(ans => 
      {
        console.log(ans);
        this.suggestions = ans
      }, 
      err => console.log(err));
  }

}
