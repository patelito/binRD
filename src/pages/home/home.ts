import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Description } from '../description/description';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  posts: Object[];
  bookmarks: Object[];

  constructor(public navCtrl: NavController, private databaseprovider: DatabaseProvider, private platform: Platform) {
    this.posts = [
      {
        title: "Tesla Roadster",
        price: 80000.00,
        image:'https://www.tesla.com/sites/default/files/images/roadster/roadster-social.jpg',
        username: 'jtaveras',
      },
      {
        title: "Tesla Model 3",
        price: 25000.00,
        image: 'https://www.diariomotor.com/imagenes/picscache/1920x1600c/tesla-model-3-01_1920x1600c.jpg',
        username: 'pdslopez',
      },
      {
        title: "Tesla Model S",
        price: 40000.00,
        image: 'https://www.tesla.com/tesla_theme/assets/img/models/v1.0/section-hero-background.jpg?20180111',
        username: 'vicdiaz',
      },
      {
        title: "Tesla Model Y",
        price: 35000.00,
        image: 'https://thedriven.io/wp-content/uploads/2019/03/Model-Y-Front-34-Blue.jpg',
        username: 'cargr',
      },
    ];

    this.databaseprovider.getDatabaseState().subscribe( rdy => {
      if( rdy ) {
        this.loadData()
      }
    })
  }

  loadData() {
    this.databaseprovider.getAllPost().then( data=> {
      console.log("DATA: ", data);
    })
  }
  open(){
    this.navCtrl.push(Description);
  }

}
