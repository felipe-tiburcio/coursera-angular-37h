import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})


export class MenuComponent implements OnInit {
  dishes: Dish[];
  errMess: string;

  constructor(
    private DishService: DishService,
    @Inject('BaseUrl') public BaseUrl
  ) { 
  }

  ngOnInit() {
    this.DishService.getDishes()
      .subscribe((dishes) => this.dishes = dishes,
      errMess => this.errMess = <any>errMess);    
  }

}
