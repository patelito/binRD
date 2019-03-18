import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { HomePage } from '../home/home';

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

  categories =[];
  searchText: string;

  constructor(public navCtrl: NavController, private dbProvider: DatabaseProvider, public navParams: NavParams) {
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if(ready) {
        this.initializeCategories();
      }
    });
  }

  initializeCategories() {
    this.dbProvider.getCategories().then(data => {
      this.categories = data;
    });
  }

  selectCategory(category) {
    console.log('CATEGORY SELECTED', category);
    this.navCtrl.push(HomePage, {catId: category.id, pageTitle: category.name});
  }

  searchSubmit(ev: any) {
    console.log('SEARCH', this.searchText);
    this.navCtrl.push(HomePage, {search: this.searchText, pageTitle: 'Resultados'});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

}
