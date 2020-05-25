import {Tag} from './tag';
import {Category} from './category';

export interface QuizFilterSettings {
  quizName: string;
  userName: string;
  moreThanRating: string;
  lessThanRating: string;
  orderByRating: boolean;
  tags: Tag[];
  categories: Category[];
  quizLang: string;
}
