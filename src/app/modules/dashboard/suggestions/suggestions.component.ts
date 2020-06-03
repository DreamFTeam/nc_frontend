import {Component, OnInit, OnDestroy} from '@angular/core';
import {SuggestionService} from '../../core/_services/user/suggestion.service';
import {AuthenticationService} from '../../core/_services/authentication/authentication.service';
import {Role} from '../../core/_models/role';
import {ExtendedQuizPreview} from '../../core/_models/extendedquiz-preview';
import {ToastsService} from '../../core/_services/utils/toasts.service';
import { Subscription } from 'rxjs';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';


@Component({
    selector: 'app-suggestions',
    templateUrl: './suggestions.component.html',
    styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit, OnDestroy {

    subscriptions: Subscription = new Subscription();

    mockImgUrl = '../../assets/img/quiz.jpg';
    suggestions: ExtendedQuizPreview[];

    faSpinner = faSpinner;
    isLoading: boolean;
    isEmpty: boolean;
    constructor(private suggestionService: SuggestionService,
                private authenticationService: AuthenticationService,
                public toastsService: ToastsService) {
        this.suggestions = [];
        this.isLoading = true;
        this.isEmpty = false;
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    ngOnInit(): void {
        const user = this.authenticationService.currentUserValue;
        if (user && user.role === Role.User) {
            this.subscriptions.add(this.suggestionService.getSuggestionList().subscribe(ans => {
                    this.suggestions = ans;
                    if(ans.length == 0){
                        this.isEmpty = true;
                    }
                    this.isLoading = false;
                },
                err => this.toastsService.toastAddDanger('Something went wrong while fetching suggestions.\nWe are sorry for that')));
        }
    }

    getCssClass(){
        switch(this.suggestions.length){
            case 3:
                return "card-body card-group row row-cols-3";
            case 2:
                return "card-body card-group row row-cols-2";
            default:
                return "card-body card-group row"
            
        }
    }

}
