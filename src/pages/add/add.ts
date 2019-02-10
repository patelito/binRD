import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {

  selectedMedia: object[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedMedia = [
      { thumbnail: 'https://st.motortrend.com/uploads/sites/5/2016/10/2016-Tesla-Model-S-60-front-three-quarter-in-motion-02-e1477952073682.jpg'},
      { thumbnail: 'https://www.tesla.com/content/dam/tesla-site/sx-redesign/img/models/footer/models@2.jpg'},
      { thumbnail: 'https://www.carzone.ie/reviews/images/591_ev4.JPG'},
      { thumbnail: 'https://www.carzone.ie/reviews/images/591_ev4.JPG'},
      { thumbnail: 'https://www.carzone.ie/reviews/images/591_ev4.JPG'}
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPage');
  }

}
