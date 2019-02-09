import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  categories: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initializeCategories();
  }

  initializeCategories() {
    this.categories = [
      'Accesorios',
      'Vehiculos',
      'Inmuebles',
      'Electrónico',
      'Hogar'
    ];
  }

  selectCategory(category) {
    console.log('CATEGORY SELECTED', category);
  }

  searchSubmit(ev: any) {
    console.log('SEARCH', ev);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

}
