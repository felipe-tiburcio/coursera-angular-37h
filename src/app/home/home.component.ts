import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  dishErrMess: string;
  promotion: Promotion;
  leader: Leader;

  constructor(
    private dishService: DishService, 
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseUrl')public BaseUrl
  ) { }

  ngOnInit() {
    this.dishService.getFeaturedDish()
      .subscribe((dish)=> this.dish = dish,
        errMess => this.dishErrMess = <any>errMess);

    this.promotionService.getFeaturedPromotion()
      .subscribe((promotion) => this.promotion = promotion);
    
    this.leaderService.getFeaturedLeader()
      .subscribe((leader) => this.leader = leader);
  }

}
