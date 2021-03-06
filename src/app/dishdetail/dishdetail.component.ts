import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from "@angular/animations";

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css'],
  animations: [
    trigger('visibility', [
      state('shown', style({
        transform: 'scale(1.0)',
        opacity: 1
      })),
      state('hidden', style({
        transform: 'scale(0.5)',
        opacity: 0
      })),
      transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})

export class DishdetailComponent implements OnInit {

  dish: Dish;
  errMess: string
  dishIds: string[];
  prev: string;
  next: string;

  month: any;
  day: any;
  year: any;

  form: FormGroup;
  dishCopy: Dish;
  visibility = 'shown';

  @ViewChild('fform') formDirective;

  formErrors = {
    'rating': '',
    'comment': '',
    'author': '',
    'date': ''
  };

  validationMessages = {
    'author': {
      'required':      'Author is required.',
      'minlength':     'Author must be at least 2 characters long.',
      'maxlength':     'Author cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
    },
  };

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute, 
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseUrl') public BaseUrl 
  ) {
    this.createForm();
  };

  ngOnInit() {
    this.dishService.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishCopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess);
  }

  createForm() {
    this.form = this.fb.group({
      rating: [ 5, [] ],
      comment: [ '', [Validators.required] ],
      author: [ '', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      date: [ '', [] ]
    });
    this.form.valueChanges
      .subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    if (!this.form) { return; }
    const form = this.form;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length]
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length]
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.form.value.date = this.getDate();
    this.getDate();
    this.dishCopy.comments.push(this.form.value);
    this.dishService.putDish(this.dishCopy)
      .subscribe(dish => {
        this.dish = dish;
        this.dishCopy = dish;
      },
      errMess => {
        this.dish = null;
        this.dishCopy = null;
        this.errMess = <any>errMess
      }
      );
    this.form.reset();
    this.createForm();
  }

  getDate() {
    let commentDate = "";

    const date = new Date();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthNumber = date.getMonth();

    this.day = date.getDate();
    this.month = monthNames[monthNumber];
    this.year = date.getFullYear();

    commentDate = `${this.month} ${this.day}, ${this.year}`;
    
    return commentDate;
  }

}


