import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddRestaurantPage } from '../add-restaurant/add-restaurant';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  addRestaurantPage = AddRestaurantPage;

  constructor(public navCtrl: NavController) {

  }

}
