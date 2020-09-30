import { Component, OnInit, Input } from '@angular/core';
import { Dish } from "../shared/dish";

/*Input es una forma de proporcionar informacion
a un componente desde otro componente */

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  @Input()
  dish: Dish;

  constructor() { }

  ngOnInit() {
  }

}
