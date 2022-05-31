import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Dish } from '../shared/dish';
import { map, catchError } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../shared/baseUrl';
import { ProcessHttpMsgService } from './process-http-msg.service';


@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(
      private http: HttpClient,
      private processHttpMsgService: ProcessHttpMsgService
    ) {
  }
  
  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(baseUrl + 'dishes')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
  
  getDish(id: string): Observable<Dish> {
    return this.http.get<Dish>(baseUrl + 'dishes/' + id)
    .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getFeaturedDish(): Observable<Dish> {
    return this.http.get<Dish>(baseUrl + 'dishees?featured=true')
      .pipe(map(dishes => dishes[0]))
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getDishIds(): Observable<string[] | any> {
    return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id)))
      .pipe(catchError(error => error));
  }

}
