import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Dish } from "../shared/dish";
import { DishService } from '../services/dish.service';
import { Comment, dateISO } from '../shared/comment';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/*Input es una forma de proporcionar informacion
a un componente desde otro componente */

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dishIds: string[];
  prev: string;
  next: string;
  dish: Dish;
  commentForm: FormGroup;
  comment: Comment;
  dateiso = dateISO;
  @ViewChild('fform') commentFormDirective;


  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Author is required.',
      'minlength':     'Author must be at least 2 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
    },

  };

  constructor(private dishService: DishService,
  	private route: ActivatedRoute,
  	private location: Location,
    private fb: FormBuilder,
    @Inject('baseURL') private baseURL) 
  {
    this.createForm();
  }

  ngOnInit() { /*dihditail/(id que recibe)*/

    this.dishService.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
  	this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)] ],
      rating: '5',
      comment: ['', [Validators.required] ],
      date: this.dateiso
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now

  }

  onSubmit() {
    this.commentForm.value.date = this.dateiso;
    this.comment = this.commentForm.value;
    console.log(this.comment);
    this.dish.comments.push(this.commentForm.value);
    this.commentForm.reset({
      author: '',
      rating: '5',
      comment: '',
      date: this.dateiso
    });
    this.commentFormDirective.resetForm(
      {rating: 5});
  }


  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
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
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

}
